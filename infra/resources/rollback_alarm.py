"""Owns the deployment rollback alarm that ECS Express otherwise creates itself.

The default alarm counts 4XX as a deployment failure and divides by
`RequestCountPerTarget` (a per-target average), which inflates the rate by the
task count. Neither is configurable via the express API, so we take over the
alarm under the same name and correct it to 5XX over `RequestCount`.
"""

from dataclasses import dataclass

import pulumi
import pulumi_aws as aws

# ECS Express tags both of a service's blue/green target groups with this.
_TARGET_GROUP_NAME_TAG = "{theme}-frontend"


@dataclass
class RollbackAlarmConfig:
    """Configuration for the deployment rollback alarm."""

    theme: str
    cluster: str
    service_name: str
    # Percentage of requests returning 5XX that fails a deployment.
    threshold: float = 1.0
    evaluation_periods: int = 3
    datapoints_to_alarm: int = 2
    period: int = 60


def _dimension_from_arn(arn: str) -> str:
    """CloudWatch wants the ARN suffix, e.g. `targetgroup/name/id`."""
    return arn.rsplit(":", maxsplit=1)[-1]


def _load_balancer_dimension(arn: str) -> str:
    """CloudWatch wants `app/name/id`, i.e. everything after `loadbalancer/`."""
    return arn.rsplit("loadbalancer/", maxsplit=1)[-1]


class RollbackAlarm(pulumi.ComponentResource):
    """A 5XX-only error rate alarm, replacing the ECS Express default."""

    def __init__(
        self,
        name: str,
        config: RollbackAlarmConfig,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("pkg:index:RollbackAlarm", name, None, opts)

        target_group_tag = _TARGET_GROUP_NAME_TAG.format(theme=config.theme)
        target_groups = aws.resourcegroupstaggingapi.get_resources(
            resource_type_filters=["elasticloadbalancing:targetgroup"],
            tag_filters=[
                aws.resourcegroupstaggingapi.GetResourcesTagFilterArgs(
                    key="Name", values=[target_group_tag]
                ),
                aws.resourcegroupstaggingapi.GetResourcesTagFilterArgs(
                    key="AmazonECSManaged", values=["true"]
                ),
            ],
        )
        target_group_arns = sorted(
            mapping.resource_arn for mapping in target_groups.resource_tag_mapping_lists
        )
        if not target_group_arns:
            raise Exception(
                f"No ECS-managed target groups tagged Name={target_group_tag}."
            )

        # The idle half of the blue/green pair can be detached between deployments,
        # so find one that is still attached.
        load_balancer_arn = next(
            (
                arns[0]
                for arns in (
                    aws.lb.get_target_group(arn=arn).load_balancer_arns
                    for arn in target_group_arns
                )
                if arns
            ),
            None,
        )
        if load_balancer_arn is None:
            raise Exception(
                f"No target group for {config.service_name} is attached to a load "
                "balancer, so the alarm's dimensions cannot be resolved."
            )
        lb_dimension = _load_balancer_dimension(load_balancer_arn)

        # Either half of the blue/green pair can fail a deployment, so score each
        # and alarm on the worse.
        queries: list[aws.cloudwatch.MetricAlarmMetricQueryArgs] = []
        for index, target_group_arn in enumerate(target_group_arns):
            dimensions = {
                "TargetGroup": _dimension_from_arn(target_group_arn),
                "LoadBalancer": lb_dimension,
            }
            queries.append(
                aws.cloudwatch.MetricAlarmMetricQueryArgs(
                    id=f"m{index}_5xx",
                    metric=aws.cloudwatch.MetricAlarmMetricQueryMetricArgs(
                        namespace="AWS/ApplicationELB",
                        metric_name="HTTPCode_Target_5XX_Count",
                        dimensions=dimensions,
                        period=config.period,
                        stat="Sum",
                    ),
                    return_data=False,
                )
            )
            queries.append(
                aws.cloudwatch.MetricAlarmMetricQueryArgs(
                    id=f"m{index}_total",
                    metric=aws.cloudwatch.MetricAlarmMetricQueryMetricArgs(
                        namespace="AWS/ApplicationELB",
                        metric_name="RequestCount",
                        dimensions=dimensions,
                        period=config.period,
                        stat="Sum",
                    ),
                    return_data=False,
                )
            )
            queries.append(
                aws.cloudwatch.MetricAlarmMetricQueryArgs(
                    id=f"em{index}",
                    # FILL guards against a zero denominator in quiet minutes.
                    expression=f"100 * m{index}_5xx / FILL(m{index}_total, 1)",
                    label=f"5XX percentage for target group {index}",
                    return_data=False,
                )
            )

        worst = ",".join(f"em{index}" for index in range(len(target_group_arns)))
        queries.append(
            aws.cloudwatch.MetricAlarmMetricQueryArgs(
                id="e",
                expression=f"MAX([{worst}])",
                label="5XX error percentage",
                # Exactly one query may return data.
                return_data=True,
            )
        )

        self.alarm = aws.cloudwatch.MetricAlarm(
            f"{name}-rollback-alarm",
            # Must match the name ECS Express used, or the service's
            # deploymentConfiguration still points at the broken alarm.
            name=f"{config.cluster}/{config.service_name}/RollbackAlarm",
            alarm_description="Rate of 5XX errors",
            comparison_operator="GreaterThanThreshold",
            evaluation_periods=config.evaluation_periods,
            datapoints_to_alarm=config.datapoints_to_alarm,
            threshold=config.threshold,
            treat_missing_data="notBreaching",
            actions_enabled=True,
            metric_queries=queries,
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.register_outputs({"alarm_arn": self.alarm.arn})
