"""Owns the ECS cluster that the long-lived frontend services run in."""

import pulumi
from resources.ecs_cluster import EcsCluster, EcsClusterConfig

org_name = "climatepolicyradar"
stack = pulumi.get_stack()

# Vpc ID and CloudFront origin prefix list ID are required for the cluster's
# CloudFront-locked ALB security group.
aws_env_stack = pulumi.StackReference(f"{org_name}/aws_env/{stack}")

frontend_ecs_cluster = EcsCluster(
    name="frontend",
    config=EcsClusterConfig(
        vpc_id=aws_env_stack.get_output("vpc_id"),
        cloudfront_origin_prefix_list_id=aws_env_stack.get_output(
            "cloudfront_origin_prefix_list_id"
        ),
        environment=stack,
    ),
)

pulumi.export("frontend_ecs_cluster_arn", frontend_ecs_cluster.cluster_arn)
pulumi.export(
    "frontend_ecs_cluster_task_execution_role_arn",
    frontend_ecs_cluster.task_execution_role_arn,
)
pulumi.export(
    "frontend_ecs_cluster_infrastructure_role_arn",
    frontend_ecs_cluster.infrastructure_role_arn,
)
pulumi.export(
    "frontend_ecs_cluster_security_group_id", frontend_ecs_cluster.security_group_id
)
