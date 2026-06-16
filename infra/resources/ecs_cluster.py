from dataclasses import dataclass
from typing import Any, Dict, Optional

import pulumi
import pulumi_aws as aws

from .util import tag_name


@dataclass
class EcsClusterConfig:
    vpc_id: pulumi.Input[str]
    cloudfront_origin_prefix_list_id: pulumi.Input[str]
    cluster_name: str = "frontend"
    alb_ingress_port: int = 80


class EcsCluster(pulumi.ComponentResource):
    """Shared ECS platform for all frontend services: one 'frontend' cluster,
    shared execution + infrastructure + default task roles, and a shared
    CloudFront-locked ALB SG. Instantiate ONCE, in the platform stack."""

    def __init__(
        self,
        name: str,
        config: EcsClusterConfig,
        tags: Optional[Dict[str, Any]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:EcsCluster", name, opts)

        self.opts = self._get_opts(opts)
        self.stack = pulumi.get_stack()
        self.project = pulumi.get_project()
        self._name_prefix = tag_name()

        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": self.stack,
            "CPR-Pulumi-Project-Name": self.project,
            "CPR-Pulumi-Resource-Name": self._name_prefix,
        }

        self.tags = default_tags | (tags or {})

        cluster = aws.ecs.Cluster(
            f"{config.cluster_name}-{self.stack}-ecs-cluster",
            name=f"{config.cluster_name}-{self.stack}",
            settings=[
                aws.ecs.ClusterSettingArgs(
                    name="containerInsights",
                    value="enabled",
                )
            ],
            tags=self.tags,
        )

        # Execution role: pulls images, injects secrets, writes logs
        self.task_execution_role = aws.iam.Role(
            f"{config.cluster_name}-{self.stack}-ecs-task-execution-role",
            name=f"{config.cluster_name}-{self.stack}-ecs-task-execution-role",
            assume_role_policy=aws.iam.get_policy_document(
                statements=[
                    aws.iam.GetPolicyDocumentStatementArgs(
                        effect="Allow",
                        principals=[
                            aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                                type="Service",
                                identifiers=["ecs-tasks.amazonaws.com"],
                            )
                        ],
                        actions=["sts:AssumeRole"],
                    ),
                ]
            ).json,
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
            ],
            tags=self.tags,
        )

        # Infrastructure role: manages ALB registrations and networking
        self.infrastructure_role = aws.iam.Role(
            f"{config.cluster_name}-{self.stack}-ecs-task-infrastructure-role",
            name=f"{config.cluster_name}-{self.stack}-ecs-task-infrastructure-role",
            assume_role_policy=aws.iam.get_policy_document(
                statements=[
                    aws.iam.GetPolicyDocumentStatementArgs(
                        effect="Allow",
                        principals=[
                            aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                                type="Service",
                                identifiers=["ecs.amazonaws.com"],
                            )
                        ],
                        actions=["sts:AssumeRole"],
                    )
                ]
            ).json,
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/service-role/"
                "AmazonECSInfrastructureRoleforExpressGatewayServices",
            ],
            tags=self.tags,
        )

        self.alb_security_group = aws.ec2.SecurityGroup(
            f"{config.cluster_name}-{self.stack}-ecs-alb-sg",
            name=f"{config.cluster_name}-{self.stack}-ecs-alb-sg",
            description="HTTP from CloudFront to the frontend Express Gateway ALBs",
            vpc_id=config.vpc_id,
            ingress=[
                aws.ec2.SecurityGroupIngressArgs(
                    description="HTTP from CloudFront edge locations",
                    from_port=config.alb_ingress_port,
                    to_port=config.alb_ingress_port,
                    protocol="tcp",
                    prefix_list_ids=[config.cloudfront_origin_prefix_list_id],
                )
            ],
            egress=[
                aws.ec2.SecurityGroupEgressArgs(
                    from_port=0,
                    to_port=0,
                    protocol="-1",
                    cidr_blocks=["0.0.0.0/0"],
                )
            ],
            tags=self.tags,
        )

        self.cluster_arn = cluster.arn
        self.cluster_name = cluster.name
        self.task_execution_role_arn = self.task_execution_role.arn
        self.task_execution_role_name = self.task_execution_role.name
        self.infrastructure_role_arn = self.infrastructure_role.arn
        self.infrastructure_role_name = self.infrastructure_role.name
        self.security_group_id = self.alb_security_group.id

        self.register_outputs(
            {
                "cluster_arn": self.cluster_arn,
                "cluster_name": self.cluster_name,
                "task_execution_role_arn": self.task_execution_role_arn,
                "task_execution_role_name": self.task_execution_role_name,
                "infrastructure_role_arn": self.infrastructure_role_arn,
                "infrastructure_role_name": self.infrastructure_role_name,
                "security_group_id": self.security_group_id,
            }
        )

    def _get_opts(
        self, opts: Optional[pulumi.ResourceOptions] = None
    ) -> pulumi.ResourceOptions:
        return pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
