from dataclasses import dataclass
from typing import Dict, Optional

import pulumi
import pulumi_aws as aws
from pulumi_aws.ecs.express_gateway_service import (
    ExpressGatewayService,
    ExpressGatewayServiceNetworkConfigurationArgs,
    ExpressGatewayServicePrimaryContainerArgs,
    ExpressGatewayServicePrimaryContainerEnvironmentArgs,
    ExpressGatewayServicePrimaryContainerSecretArgs,
    ExpressGatewayServiceScalingTargetArgs,
)


@dataclass
class ExpressGatewayConfig:
    port: int = 8080
    health_check_path: str = "/"
    cpu: str = "1024"
    memory: str = "2048"


def prefix_name() -> str:
    stack = pulumi.get_stack()  # e.g. "mcf-staging" or "mcf-production"
    app, env = stack.rsplit("-", 1)
    return f"{app}-frontend-{env}"


class ExpressGatewayServiceComponent(pulumi.ComponentResource):
    def __init__(
        self,
        name: str,
        config: ExpressGatewayConfig,
        image_identifier: str,
        cluster_arn: pulumi.Output[str],
        task_execution_role_arn: pulumi.Output[str],
        infrastructure_role_arn: pulumi.Output[str],
        security_group_ids: list[pulumi.Output[str]],
        subnets: list[pulumi.Output[str]],
        env_vars: Optional[Dict[str, str]] = None,
        runtime_environment_secrets: Optional[Dict[str, pulumi.Output]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):
        super().__init__("pkg:index:ExpressGatewayService", name, None, opts)
        self._prefix = prefix_name()
        self._opts = self._get_opts(opts)

        ecs_task_role = aws.iam.Role(
            f"{self._prefix}-ecs-task-role",
            name=f"{self._prefix}-ecs-task-role",
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
        )

        primary = ExpressGatewayServicePrimaryContainerArgs(
            image=image_identifier,
            container_port=config.port,
            environments=[
                ExpressGatewayServicePrimaryContainerEnvironmentArgs(name=k, value=v)
                for k, v in (env_vars or {}).items()
            ],
            secrets=[
                ExpressGatewayServicePrimaryContainerSecretArgs(name=k, value_from=v)
                for k, v in (runtime_environment_secrets or {}).items()
            ],
        )

        self.service = ExpressGatewayService(
            f"{self._prefix}-ecs-express-service",
            service_name=self._prefix,
            cluster=cluster_arn,
            execution_role_arn=task_execution_role_arn,
            infrastructure_role_arn=infrastructure_role_arn,
            task_role_arn=ecs_task_role.arn,  # service-specific
            primary_container=primary,
            health_check_path=config.health_check_path,
            cpu=config.cpu,
            memory=config.memory,
            scaling_targets=[
                ExpressGatewayServiceScalingTargetArgs(
                    auto_scaling_metric="AVERAGE_CPU",
                    auto_scaling_target_value=70,
                    min_task_count=1,
                    max_task_count=4,
                ),
            ],
            network_configurations=[
                ExpressGatewayServiceNetworkConfigurationArgs(
                    security_groups=security_group_ids, subnets=subnets
                ),
            ],
        )

        self.url = self.service.ingress_paths.apply(
            lambda p: p[0].endpoint if p else None
        )
        self.domain_name = self.url.apply(
            lambda u: u.removeprefix("https://") if u else None
        )
        self.register_outputs({"url": self.url, "domain_name": self.domain_name})

    def _get_opts(
        self, opts: Optional[pulumi.ResourceOptions] = None
    ) -> pulumi.ResourceOptions:
        return pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
