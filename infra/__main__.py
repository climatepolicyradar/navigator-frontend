"""An AWS Python Pulumi program."""

import pulumi
import pulumi_aws as aws
from util.naming import DEFAULT_TAGS, NAME_PREFIX
from apprunner.main import create_apprunner_config, create_frontend_auto_scaling_config
from util.validate_aws_account import validate_aws_account, validate_stack_and_branch

validate_aws_account()
validate_stack_and_branch()

CONFIG = pulumi.Config()
FRONTEND_ENV = {
    "THEME": CONFIG.require("theme"),
    "API_URL": CONFIG.require("api_url"),
    "ADOBE_API_KEY": CONFIG.require("adobe_api_key"),
    "ROBOTS": CONFIG.require("robots"),
    "HOSTNAME": CONFIG.require("hostname"),
    "S3_PATH": CONFIG.require("s3-path"),
}

IRELAND_RESOURCE = pulumi.ResourceOptions(
    provider=aws.Provider("eu-west-1", region="eu-west-1")
)
SMALL_INSTANCE = aws.apprunner.ServiceInstanceConfigurationArgs()


IMAGE_IDENTIFIER = f"{CONFIG.require('ecr_uri')}:{CONFIG.require('docker_tag')}"

auto_scaling_config = create_frontend_auto_scaling_config()
frontend = aws.apprunner.Service(
    resource_name=f"Navigator-apprunner-{NAME_PREFIX}",
    service_name=f"Navigator-{NAME_PREFIX}",
    opts=IRELAND_RESOURCE,
    instance_configuration=SMALL_INSTANCE,
    auto_scaling_configuration_arn=auto_scaling_config.arn,
    source_configuration=create_apprunner_config(
        account_id=aws.get_caller_identity().account_id,
        image_identifier=IMAGE_IDENTIFIER,
        env=FRONTEND_ENV,
    ),
    tags=DEFAULT_TAGS,
)

pulumi.export("frontend service name", frontend.service_name)
pulumi.export("frontend arn", frontend.arn)
