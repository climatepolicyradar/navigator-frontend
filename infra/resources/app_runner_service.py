"""Pulumi component resources for frontend infrastructure."""

import json
import re
from dataclasses import dataclass
from typing import Dict, Optional, cast

import pulumi
import pulumi_aws as aws

from resources.util import tag_name

account_id = aws.get_caller_identity().account_id


@dataclass
class VpcConfig:
    """Configuration for VPC connectivity.

    :param vpc_connector_arn: ARN of an existing VPC connector to use
    :type vpc_connector_arn: Optional[str]
    :param security_groups: List of security group IDs
    :type security_groups: Optional[list[str]]
    :param subnets: List of subnet IDs
    :type subnets: Optional[list[str]]
    """

    vpc_connector_arn: Optional[str] = None
    security_groups: Optional[list[str]] = None
    subnets: Optional[list[str]] = None


@dataclass
class HealthCheckConfig:
    """Configuration for health checks.

    :param path: Health check path, defaults to "/health"
    :type path: str
    :param protocol: Health check protocol, defaults to "HTTP"
    :type protocol: str
    """

    path: str = "/health"
    protocol: str = "HTTP"


@dataclass
class AppRunnerConfig:
    """Configuration for AppRunner service.

    :param max_concurrency: Maximum number of concurrent requests per instance
    :type max_concurrency: int
    :param max_instances: Maximum number of instances
    :type max_instances: int
    :param min_instances: Minimum number of instances
    :type min_instances: int
    :param port: Port to expose, defaults to 8080
    :type port: int
    :param cpu: CPU for the service, defaults to "1 vCPU"
    :type cpu: str
    :param memory: Memory for the service, defaults to "2 GB"
    :type memory: str
    :param region: Region to deploy the service to, defaults to eu-west-1
    :type region: str
    :param auto_deploy: Whether to enable auto-deploy, defaults to False
    :type auto_deploy: bool
    :param vpc_config: Optional VPC configuration
    :type vpc_config: Optional[VpcConfig]
    :param health_check_config: Optional health check configuration
    :type health_check_config: Optional[HealthCheckConfig]
    :param s3_bucket_access: Optional S3 bucket access configuration
    :type s3_bucket_access: Optional[dict[str, list[str]]]
    :param ssm_access: Whether to enable SSM access, defaults to False
    :type ssm_access: bool
    :param custom_domain: Optional custom domain name for the service
    :type custom_domain: Optional[str]
    """

    max_concurrency: int
    max_instances: int
    min_instances: int
    port: int = 8080
    cpu: str = "1 vCPU"
    memory: str = "2 GB"
    region: str = "eu-west-1"
    auto_deploy: bool = False
    vpc_config: Optional[VpcConfig] = None
    health_check_config: Optional[HealthCheckConfig] = None
    s3_bucket_access: Optional[dict[str, list[str]]] = None
    ssm_access: bool = False
    custom_domain: Optional[str] = None


class AppRunnerService(pulumi.ComponentResource):
    """A component resource for creating an AppRunner service with associated IAM roles.

    :param name: Unique name for the component
    :type name: str
    :param config: AppRunner configuration settings
    :type config: AppRunnerConfig
    :param image_identifier: Image identifier for the service
    :type image_identifier: str
    :param env_vars: Environment variables for the service
    :type env_vars: Optional[Dict[str, str]]
    :param tags: Resource tags
    :type tags: Optional[Dict[str, str]]
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    :param auto_scaling_config_arn: Optional ARN for an existing auto scaling configuration
    :type auto_scaling_config_arn: Optional[str]
    """

    _APP_RUNNER_ACCESS_POLICY = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "sts:AssumeRole",
                "Effect": "Allow",
                "Sid": "",
                "Principal": {"Service": "build.apprunner.amazonaws.com"},
            },
            {
                "Effect": "Allow",
                "Principal": {"Service": "tasks.apprunner.amazonaws.com"},
                "Action": "sts:AssumeRole",
            },
        ],
    }

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

    def __init__(
        self,
        name: str,
        config: AppRunnerConfig,
        image_identifier: str,
        env_vars: Optional[Dict[str, str]] = None,
        tags: Optional[Dict[str, str]] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
        auto_scaling_config_arn: Optional[str] = None,
        runtime_environment_secrets: Optional[Dict[str, pulumi.Output]] = None,
        access_role_arn: Optional[pulumi.Input[str]] = None,
    ):
        super().__init__("pkg:index:AppRunnerService", name, None, opts)

        self._name = name
        self._name_prefix = tag_name()
        self._opts = self._merge_opts(opts)

        # Set default tags first, then extend/override with user tags if provided
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": self._name_prefix,
        }

        # If user provided tags, update defaults with them (user tags take precedence)
        self.tags = default_tags | (tags or {})

        # Create auto scaling config
        self.auto_scaling_config_arn = self._get_auto_scaling_config_arn(
            config, auto_scaling_config_arn
        )

        # Use a shared ECR access role if provided, otherwise create one per stack.
        # Shared roles avoid the 64-character IAM name limit that ephemeral PR
        # stacks can hit when names are auto-generated.
        if access_role_arn is not None:
            self.access_role_arn: pulumi.Input[str] = access_role_arn
            self.access_role: Optional[aws.iam.Role] = None
        else:
            self.access_role = self._create_access_role()
            self.access_role_arn = self.access_role.arn

        self.instance_role = self._create_instance_role(config)

        # Create VPC connector if needed
        self.vpc_connector = (
            self._create_vpc_connector(config.vpc_config) if config.vpc_config else None
        )

        # Create AppRunner service
        self.service = self._create_service(
            config,
            image_identifier,
            env_vars,
            runtime_environment_secrets=runtime_environment_secrets,
        )

        # Create custom domain association if specified
        self.custom_domain_association = None
        if config.custom_domain:
            self.custom_domain_association = self._create_custom_domain_association(
                config.custom_domain
            )

        self.register_outputs(
            {
                "service_name": self.service.service_name,
                "service_url": self.service.service_url,
                "service_arn": self.service.arn,
                "custom_domain": (
                    self.custom_domain_association.domain_name
                    if self.custom_domain_association
                    else None
                ),
                "custom_domain_url": (
                    f"https://{self.custom_domain_association.domain_name}"
                    if self.custom_domain_association
                    else None
                ),
            }
        )

    def _get_auto_scaling_config_arn(
        self, config: AppRunnerConfig, auto_scaling_config_arn: Optional[str]
    ) -> str:
        """Get the appropriate auto scaling configuration ARN.

        For the main frontend (staging/production), creates a new config.
        For custom apps, uses the existing frontend's config ARN.
        """
        if auto_scaling_config_arn is None:
            # Create new scaling config for CPR frontends
            scaling_config = self._create_scaling_config(config)
            return cast(str, scaling_config.arn)
        else:
            # Custom apps use existing frontend scaling config
            return auto_scaling_config_arn

    def _create_scaling_config(
        self, config: AppRunnerConfig
    ) -> aws.apprunner.AutoScalingConfigurationVersion:
        """Create AppRunner auto scaling configuration."""
        name = f"{self._name_prefix}-sc"
        return aws.apprunner.AutoScalingConfigurationVersion(
            name,
            auto_scaling_configuration_name=name,
            max_concurrency=config.max_concurrency,
            max_size=config.max_instances,
            min_size=config.min_instances,
            tags={"Name": name},
            opts=self._opts,
        )

    def _create_access_role(self) -> aws.iam.Role:
        """Create IAM role for AppRunner ECR access."""
        role = aws.iam.Role(
            f"{self._name_prefix}-apprunner-access-role",
            assume_role_policy=json.dumps(self._APP_RUNNER_ACCESS_POLICY),
            tags=self.tags,
            opts=self._opts,
        )

        policy = aws.iam.Policy(
            f"{self._name_prefix}-apprunner-ecr-access-policy",
            policy=json.dumps(self._ECR_ACCESS_POLICY),
            opts=self._opts,
        )

        aws.iam.RolePolicyAttachment(
            f"{self._name_prefix}-apprunner-role-policy-attach-ecr-access-policy",
            role=role.name,
            policy_arn=policy.arn,
            opts=self._opts,
        )

        return role

    def _create_s3_access_policy(
        self, config, apprunner_instance_role
    ) -> aws.iam.Policy:
        """Create S3 access policy based on config.s3_bucket_access.

        :param apprunner_instance_role: The AppRunner instance IAM role
        :type apprunner_instance_role: aws.iam.Role
        :return: The created IAM policy
        :rtype: aws.iam.Policy
        """
        if not config.s3_bucket_access:
            return None

        statements = []
        for bucket, actions in config.s3_bucket_access.items():
            for action in actions:
                if "bucket" in action.lower():
                    statements.append(
                        {
                            "Action": [f"s3:{action}"],
                            "Resource": f"arn:aws:s3:::{bucket}",
                            "Effect": "Allow",
                        }
                    )
                elif action == "*":
                    # For wildcard access, create a single statement with all S3 actions
                    statements.append(
                        {
                            "Action": ["s3:*"],
                            "Resource": [
                                f"arn:aws:s3:::{bucket}",
                                f"arn:aws:s3:::{bucket}/*",
                            ],
                            "Effect": "Allow",
                        }
                    )
                else:
                    statements.append(
                        {
                            "Action": [f"s3:{action}"],
                            "Resource": f"arn:aws:s3:::{bucket}/*",
                            "Effect": "Allow",
                        }
                    )

        s3_access_policy = aws.iam.Policy(
            f"{self._name_prefix}-apprunner-s3-access-policy",
            policy=json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": statements,
                }
            ),
        )
        aws.iam.RolePolicyAttachment(
            f"{self._name_prefix}-apprunner-role-policy-attach-s3-access-policy",
            role=apprunner_instance_role.name,
            policy_arn=s3_access_policy.arn,
        )
        return s3_access_policy

    def _create_ssm_access_policy(
        self, config, apprunner_instance_role
    ) -> aws.iam.Policy:
        if not config.ssm_access:
            return None

        # Replace dashes/underscores with spaces, capitalise words, join
        project_name = pulumi.get_project()
        if project_name == "otel_collector":
            project_name = "OTel"
        else:
            parts = re.split(r"[-_]", project_name)
            project_name = "".join(word.capitalize() for word in parts if word)

        ssm_access_policy = aws.iam.Policy(
            f"{self._name_prefix}-apprunner-ssm-access-policy",
            policy=json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Action": ["ssm:GetParameter", "ssm:GetParameters"],
                            "Resource": [
                                f"arn:aws:ssm:eu-west-1:*:parameter/{project_name}/*",
                                f"arn:aws:ssm:eu-west-1:*:parameter/{project_name}",
                            ],
                        }
                    ],
                }
            ),
        )
        aws.iam.RolePolicyAttachment(
            f"{self._name_prefix}-apprunner-role-policy-attach-ssm-access-policy",
            role=apprunner_instance_role.name,
            policy_arn=ssm_access_policy.arn,
        )

    def _create_instance_role(self, config: AppRunnerConfig) -> aws.iam.Role:
        if not (config.ssm_access or config.s3_bucket_access):
            return None

        apprunner_instance_role = aws.iam.Role(
            f"{self._name_prefix}-apprunner-instance-role",
            assume_role_policy=json.dumps(
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Action": "sts:AssumeRole",
                            "Effect": "Allow",
                            "Sid": "",
                            "Principal": {
                                "Service": "tasks.apprunner.amazonaws.com",
                            },
                        },
                    ],
                }
            ),
            tags=self.tags,
        )

        if config.s3_bucket_access:
            self._create_s3_access_policy(config, apprunner_instance_role)

        if config.ssm_access:
            self._create_ssm_access_policy(config, apprunner_instance_role)

        # attach the role allowing us to access SSM params for env variables
        aws.iam.RolePolicy(
            "backend-api-instance-role-ssm-policy",
            role=apprunner_instance_role.id,
            policy=aws.iam.get_policy_document(
                statements=[
                    aws.iam.GetPolicyDocumentStatementArgs(
                        effect="Allow",
                        actions=["ssm:GetParameters"],
                        resources=[
                            f"arn:aws:ssm:eu-west-1:{account_id}:parameter/backend-api/apprunner/*"
                        ],
                    )
                ]
            ).json,
        )

        return apprunner_instance_role

    def _merge_opts(
        self, opts: Optional[pulumi.ResourceOptions] = None
    ) -> pulumi.ResourceOptions:
        return pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(
                parent=self,
            ),
            opts or pulumi.ResourceOptions(),
        )

    def _create_vpc_connector(
        self, vpc_config: VpcConfig
    ) -> Optional[aws.apprunner.VpcConnector]:
        """Create VPC connector if not provided.

        :param vpc_config: VPC configuration
        :type vpc_config: VpcConfig
        :return: Created or existing VPC connector
        :rtype: Optional[aws.apprunner.VpcConnector]
        """
        if vpc_config.vpc_connector_arn:
            return aws.apprunner.VpcConnector.get(
                f"{self._name_prefix}-vpc-connector",
                vpc_config.vpc_connector_arn,
                opts=self._opts,
            )

        if not vpc_config.security_groups or not vpc_config.subnets:
            raise ValueError(
                "Security groups and subnets are required when vpc_connector_arn is not provided"
            )

        vpc_connector_tags = dict(self.tags)
        vpc_connector_tags["Name"] = f"{self._name_prefix}-vpc-connector"

        return aws.apprunner.VpcConnector(
            f"{self._name_prefix}-vpc-connector",
            vpc_connector_name=vpc_connector_tags["Name"],
            security_groups=vpc_config.security_groups,
            subnets=vpc_config.subnets,
            tags=vpc_connector_tags,
            opts=self._opts,
        )

    def _create_service(
        self,
        config: AppRunnerConfig,
        image_identifier: str,
        env_vars: Optional[Dict[str, str]],
        runtime_environment_secrets: Optional[Dict[str, pulumi.Output[str]]],
    ) -> aws.apprunner.Service:
        """Create AppRunner service."""
        # Create provider for the specific region
        provider = aws.Provider(
            f"{self._name}-app-runner-provider",
            region=config.region,
        )

        # Set resource options with the provider
        resource_opts = pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(
                provider=provider,
            ),
            self._opts,
        )

        # Prepare instance configuration
        instance_config = aws.apprunner.ServiceInstanceConfigurationArgs(
            cpu=config.cpu,
            memory=config.memory,
            instance_role_arn=self.instance_role.arn if self.instance_role else None,
        )

        # Prepare network configuration
        network_config = None
        if config.vpc_config:
            vpc_connector_arn = (
                config.vpc_config.vpc_connector_arn
                if config.vpc_config.vpc_connector_arn
                else self.vpc_connector.arn if self.vpc_connector else None
            )
            network_config = aws.apprunner.ServiceNetworkConfigurationArgs(
                egress_configuration=aws.apprunner.ServiceNetworkConfigurationEgressConfigurationArgs(
                    egress_type="VPC",
                    vpc_connector_arn=vpc_connector_arn,
                ),
            )

        # Prepare health check configuration
        health_check_config = None
        if config.health_check_config:
            health_check_config = aws.apprunner.ServiceHealthCheckConfigurationArgs(
                path=config.health_check_config.path,
                protocol=config.health_check_config.protocol,
            )

        return aws.apprunner.Service(
            resource_name=f"{self._name_prefix}-apprunner",
            service_name=self._name_prefix,
            instance_configuration=instance_config,
            network_configuration=network_config,
            health_check_configuration=health_check_config,
            auto_scaling_configuration_arn=self.auto_scaling_config_arn,
            source_configuration=aws.apprunner.ServiceSourceConfigurationArgs(
                auto_deployments_enabled=config.auto_deploy,
                image_repository=aws.apprunner.ServiceSourceConfigurationImageRepositoryArgs(
                    image_identifier=image_identifier,
                    image_repository_type="ECR",
                    image_configuration=aws.apprunner.ServiceSourceConfigurationImageRepositoryImageConfigurationArgs(
                        port=str(config.port),
                        runtime_environment_variables=env_vars,
                        runtime_environment_secrets=runtime_environment_secrets,
                    ),
                ),
                authentication_configuration=aws.apprunner.ServiceSourceConfigurationAuthenticationConfigurationArgs(
                    access_role_arn=self.access_role_arn
                ),
            ),
            tags=self.tags,
            opts=resource_opts,
        )

    def _create_custom_domain_association(
        self, domain_name: str
    ) -> aws.apprunner.CustomDomainAssociation:
        """Create custom domain association for the AppRunner service.

        :param domain_name: The custom domain name to associate
        :type domain_name: str
        :return: The custom domain association resource
        :rtype: aws.apprunner.CustomDomainAssociation
        """
        return aws.apprunner.CustomDomainAssociation(
            f"{self._name_prefix}-cda",
            domain_name=domain_name,
            service_arn=self.service.arn,
            opts=self._opts,
        )
