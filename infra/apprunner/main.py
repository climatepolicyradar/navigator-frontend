import json
from typing import Mapping, Optional

import pulumi
import pulumi_aws as aws

from util.naming import DEFAULT_TAGS, NAME_PREFIX, SCALING_NAME


CONFIG = pulumi.config.Config()
_ECR_ACCESS_POLICY = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:DescribeImages",
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
            ],
            "Resource": "*",
        }
    ],
}


def _get_apprunner_access_role() -> aws.iam.Role:
    apprunner_access_role = aws.iam.Role(
        f"{NAME_PREFIX}-apprunner-access-role",
        assume_role_policy=json.dumps(
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "sts:AssumeRole",
                        "Effect": "Allow",
                        "Sid": "",
                        "Principal": {
                            "Service": "build.apprunner.amazonaws.com",
                        },
                    },
                ],
            }
        ),
        tags=DEFAULT_TAGS,
    )

    ecr_access_policy = aws.iam.Policy(
        f"{NAME_PREFIX}-apprunner-ecr-access-policy",
        policy=json.dumps(_ECR_ACCESS_POLICY),
    )
    aws.iam.RolePolicyAttachment(
        f"{NAME_PREFIX}-apprunner-role-policy-attach-ecr-access-policy",
        role=apprunner_access_role.name,
        policy_arn=ecr_access_policy.arn,
    )

    return apprunner_access_role


def create_frontend_auto_scaling_config() -> aws.apprunner.AutoScalingConfigurationVersion:
    # Create a scaling configuration based on config
    scaling_config = aws.apprunner.AutoScalingConfigurationVersion(
        f"{NAME_PREFIX}-{SCALING_NAME}",
        auto_scaling_configuration_name=f"{NAME_PREFIX}-{SCALING_NAME}",

        max_concurrency=int(CONFIG.require("apprunner_frontend_max_concurrency")),
        max_size=int(CONFIG.require("apprunner_frontend_max_instance_count")),
        min_size=int(CONFIG.require("apprunner_frontend_min_instance_count")),
        tags={
            "Name": f"{NAME_PREFIX}-{SCALING_NAME}",
        },
    )

    return scaling_config


def create_apprunner_config(
    account_id: str,
    image_identifier: str,
    env: Optional[pulumi.Input[Mapping[str, pulumi.Input[str]]]] = None,
) -> aws.apprunner.ServiceSourceConfigurationArgs:

    image_config = (
        aws.apprunner.ServiceSourceConfigurationImageRepositoryImageConfigurationArgs(
            port="8080",
            runtime_environment_variables=env,
        )
    )

    ecr_repo = aws.apprunner.ServiceSourceConfigurationImageRepositoryArgs(
        image_identifier=image_identifier,
        image_repository_type="ECR",
        image_configuration=image_config,
    )

    return aws.apprunner.ServiceSourceConfigurationArgs(
        auto_deployments_enabled=False,
        image_repository=ecr_repo,
        authentication_configuration=aws.apprunner.ServiceSourceConfigurationAuthenticationConfigurationArgs(
            access_role_arn=_get_apprunner_access_role().arn,
        ),
    )
