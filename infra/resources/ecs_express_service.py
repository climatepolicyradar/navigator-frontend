import json
import shlex
from dataclasses import dataclass

import pulumi
import pulumi_aws as aws
import pulumi_command as command
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
    cpu: str = "4096"
    memory: str = "8192"
    min_task_count: int = 1
    max_task_count: int = 4
    # Tag identifying the service's ECS-managed target groups. Setting it points
    # the service's deployments at the alarm built below instead of the
    # RollbackAlarm ECS generates; leaving it unset keeps AWS's arrangement.
    rollback_alarm_target_group_tag: str | None = None
    # 5XX rate (as a percentage of requests) that, sustained for 2 of 3 minutes,
    # rolls a deployment back.
    rollback_alarm_error_rate_percent: float = 5


def prefix_name() -> str:
    stack = pulumi.get_stack()  # e.g. "mcf-staging" or "mcf-production"
    app, env = stack.rsplit("-", 1)
    return f"{app}-frontend-{env}"


def target_group_dimensions(name_tag: str) -> list[tuple[str, str]]:
    """
    Find the CloudWatch (load balancer, target group) dimension pairs for the
    blue/green target groups ECS manages on behalf of an Express service.

    ECS names these target groups randomly, so they are located by the `Name` tag
    ECS puts on them rather than by any predictable identifier.
    """
    tagged = aws.resourcegroupstaggingapi.get_resources(
        resource_type_filters=["elasticloadbalancing:targetgroup"],
        tag_filters=[
            aws.resourcegroupstaggingapi.GetResourcesTagFilterArgs(
                key="Name", values=[name_tag]
            )
        ],
    )

    dimensions = []
    for mapping in tagged.resource_tag_mapping_lists:
        target_group = aws.lb.get_target_group(arn=mapping.resource_arn)
        if not target_group.load_balancer_arns:
            continue
        load_balancer = aws.lb.get_load_balancer(arn=target_group.load_balancer_arns[0])
        dimensions.append((load_balancer.arn_suffix, target_group.arn_suffix))
    return dimensions


def rollback_alarm_metric_queries(
    dimensions: list[tuple[str, str]],
) -> list[aws.cloudwatch.MetricAlarmMetricQueryArgs]:
    """
    Build the metric maths for the rollback alarm.

    This differs from the alarm ECS generates in two ways:

    - 4XX responses are excluded. Expected 404 traffic is not a reason to roll a
      deployment back, and ECS counts the whole 4XX total for the minute once it
      crosses five rather than counting only the excess.
    - The denominator is RequestCount rather than RequestCountPerTarget. ECS
      divides a fleet-wide error count by a per-task request count, which
      overstates the error rate by a factor of the running task count.
    """
    queries = []
    rate_ids = []
    for index, (load_balancer, target_group) in enumerate(dimensions):
        target = {"LoadBalancer": load_balancer, "TargetGroup": target_group}
        queries += [
            aws.cloudwatch.MetricAlarmMetricQueryArgs(
                id=f"m{index}_5xx",
                metric=aws.cloudwatch.MetricAlarmMetricQueryMetricArgs(
                    namespace="AWS/ApplicationELB",
                    metric_name="HTTPCode_Target_5XX_Count",
                    dimensions=target,
                    period=60,
                    stat="Sum",
                ),
            ),
            aws.cloudwatch.MetricAlarmMetricQueryArgs(
                id=f"m{index}_total",
                metric=aws.cloudwatch.MetricAlarmMetricQueryMetricArgs(
                    namespace="AWS/ApplicationELB",
                    metric_name="RequestCount",
                    dimensions=target,
                    period=60,
                    stat="Sum",
                ),
            ),
            aws.cloudwatch.MetricAlarmMetricQueryArgs(
                id=f"e{index}",
                # 5XX is sparse and emits nothing during a quiet minute, so fill it
                # with 0 to let the alarm clear itself. Filling the denominator
                # guards the division; when there is no traffic the numerator is 0
                # too, so the minute scores 0%.
                expression=f"100 * FILL(m{index}_5xx, 0) / FILL(m{index}_total, 1)",
                label=f"5XX percentage for {target_group}",
            ),
        ]
        rate_ids.append(f"e{index}")

    queries.append(
        aws.cloudwatch.MetricAlarmMetricQueryArgs(
            id="e",
            # Whichever half of the blue/green pair is worse.
            expression=f"MAX([{', '.join(rate_ids)}])",
            label="5XX percentage",
            return_data=True,
        )
    )
    return queries


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
        env_vars: dict[str, str] | None = None,
        runtime_environment_secrets: dict[str, pulumi.Output] | None = None,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("pkg:index:ExpressGatewayService", name, None, opts)
        self._prefix = name if pulumi.get_stack().startswith("pr-") else prefix_name()
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
                    auto_scaling_metric="REQUEST_COUNT_PER_TARGET",  # Average over 60s interval
                    auto_scaling_target_value=500,  # Requests per target per minute
                    min_task_count=config.min_task_count,
                    max_task_count=config.max_task_count,
                ),
            ],
            network_configurations=[
                ExpressGatewayServiceNetworkConfigurationArgs(
                    security_groups=security_group_ids, subnets=subnets
                ),
            ],
        )

        # Gated on the tag rather than on the alarm above: the alarm only alerts,
        # so failing to resolve the target groups must not leave alarm rollback
        # switched on.
        if config.rollback_alarm_target_group_tag:
            self._disable_deployment_alarm_rollback(cluster_arn)
        self.rollback_alarm = self._create_rollback_alarm(config)

        self.url = self.service.ingress_paths.apply(
            lambda p: p[0].endpoint if p else None
        )
        self.domain_name = self.url.apply(
            lambda u: u.removeprefix("https://") if u else None
        )
        self.register_outputs({"url": self.url, "domain_name": self.domain_name})

    def _create_rollback_alarm(
        self, config: ExpressGatewayConfig
    ) -> aws.cloudwatch.MetricAlarm | None:
        """
        Create the alarm deployments of this service should roll back on.

        Deliberately named outside the `<cluster>/<service>/RollbackAlarm`
        pattern ECS uses. ECS rewrites the alarm at that name when a deployment
        starts, so anything declared there is clobbered by the very deployment
        it is meant to guard.

        Returns None when no target group tag is configured, or when the target
        groups cannot be resolved -- which is the case until the service has
        been created, so a brand new stack picks the alarm up on its second up.
        """
        name_tag = config.rollback_alarm_target_group_tag
        if not name_tag:
            return None

        dimensions = target_group_dimensions(name_tag)
        if len(dimensions) != 2:
            pulumi.log.warn(
                f"Expected 2 target groups tagged Name={name_tag}, found "
                f"{len(dimensions)}. Leaving the ECS-managed RollbackAlarm in place."
            )
            return None

        return aws.cloudwatch.MetricAlarm(
            f"{self._prefix}-rollback-alarm",
            name=f"{self._prefix}-5xx-rollback",
            alarm_description="Rate of 5XX errors",
            comparison_operator="GreaterThanThreshold",
            threshold=config.rollback_alarm_error_rate_percent,
            evaluation_periods=3,
            datapoints_to_alarm=2,
            treat_missing_data="notBreaching",
            metric_queries=rollback_alarm_metric_queries(dimensions),
            opts=pulumi.ResourceOptions(parent=self, depends_on=[self.service]),
        )

    def _disable_deployment_alarm_rollback(
        self, cluster_arn: pulumi.Output[str]
    ) -> command.local.Command:
        """
        Stop deployments rolling back on CloudWatch alarms.

        An Express service is an ordinary ECS service underneath, carrying a
        standard deploymentConfiguration whose `alarms` block is what ECS acts
        on while a deployment bakes. Neither the Express API nor the Pulumi
        resource exposes it, so it is set through the classic API.

        Naming our own alarm here is not enough: ECS appends its RollbackAlarm
        to `alarmNames` on every deployment and rolls back if any listed alarm
        fires, so that alarm's expected 4XX traffic still fails the deployment.
        Turning the block off entirely leaves the circuit breaker below to catch
        a revision that cannot reach a steady state, which is the failure worth
        rolling back on.

        The rest of the deploymentConfiguration is sent unchanged: the structure
        is replaced wholesale, so omitting the circuit breaker would quietly
        turn off that remaining protection.
        """
        deployment_configuration = json.dumps(
            {
                "deploymentCircuitBreaker": {"enable": True, "rollback": True},
                "maximumPercent": 200,
                "minimumHealthyPercent": 100,
                "alarms": {"alarmNames": [], "enable": False, "rollback": False},
            }
        )

        return command.local.Command(
            f"{self._prefix}-deployment-alarms",
            create=pulumi.Output.format(
                "aws ecs update-service --cluster {0} --service {1} --region {2}"
                " --deployment-configuration {3} --no-cli-pager"
                " --query 'service.serviceName' --output text",
                cluster_arn,
                self._prefix,
                # Taken from the cluster ARN so the command does not depend on a
                # region being set in the caller's environment.
                cluster_arn.apply(lambda arn: arn.split(":")[3]),
                shlex.quote(deployment_configuration),
            ),
            triggers=[deployment_configuration],
            opts=pulumi.ResourceOptions(parent=self, depends_on=[self.service]),
        )

    def _get_opts(
        self, opts: pulumi.ResourceOptions | None = None
    ) -> pulumi.ResourceOptions:
        return pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
