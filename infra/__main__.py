"""An AWS Python Pulumi program."""

import json
import re
from enum import Enum
from pathlib import Path
from typing import cast

import pulumi
import pulumi_aws as aws
import pulumi_docker_build as docker_build
from resources.app_runner_service import AppRunnerConfig, AppRunnerService
from resources.cache_policy import CachePolicyConfig, CloudFrontCachePolicy
from resources.cloudfront_distribution import (
    CloudFrontDistribution,
    DistributionType,
    OriginConfig,
)
from resources.cors_policy import CloudFrontCORSPolicy, CORSPolicyConfig
from resources.dns import DNS, DNSConfig
from resources.ecr_repository import ECRRepository, ECRRepositoryConfig
from resources.github_actions_role import GitHubActionsRole
from resources.util import (
    BehaviourOptions,
    CookieConfig,
    HeaderConfig,
    QueryStringConfig,
    tag_name,
    validate_aws_account,
    validate_stack_and_branch,
)

validate_aws_account()
validate_stack_and_branch()
aws_account = aws.get_caller_identity()
config = pulumi.Config()
theme = config.require("theme")


FRONTEND_ENV = {
    "BACKEND_API_TOKEN": config.require("backend_api_token"),
    "BACKEND_API_URL": config.require("backend_api_url"),
    "THEME": theme,
    "ADOBE_API_KEY": config.require("adobe_api_key"),
    "ROBOTS": config.require("robots"),
    "APP_URL": config.require("app_url"),
    "S3_PATH": config.require("s3-path"),
    "TARGETS_URL": config.require("targets_url"),
    "CDN_URL": config.require("cdn_url"),
    "CONCEPTS_API_URL": config.require("concepts_api_url"),
    "NEXT_PUBLIC_FARO_URL": config.require("next_public_faro_url"),
    "NEXT_PUBLIC_FARO_APP_NAME": config.require("next_public_faro_app_name"),
    "NEXT_PUBLIC_FARO_APP_NAMESPACE": config.require("next_public_faro_app_namespace"),
    "OTEL_EXPORTER_OTLP_ENDPOINT": config.require("otel_exporter_otlp_endpoint"),
    "OTEL_EXPORTER_OTLP_PROTOCOL": config.require("otel_exporter_otlp_protocol"),
    "OTEL_SERVICE_NAME": config.require("otel_service_name"),
    "OTEL_RESOURCE_ATTRIBUTES": config.require("otel_resource_attributes"),
}

########################################################################
# Create App Runner service
########################################################################

stack = pulumi.get_stack()
is_review_stack = stack.startswith("pr-")
is_review_template = "review" in stack
is_review_stack_or_template = is_review_stack or is_review_template
if is_review_stack:
    # Extract PR number from stack name like "pr-climatepolicyradar-navigator-frontend-1139"
    match = re.search(r"(\d+)$", stack)
    pr_number = match.group(1) if match else stack[-8:]  # fallback to last 8 chars
    review_name = f"review-{theme}-{pr_number}"  # e.g. "review-cpr-1139" (15 chars)
else:
    review_name = None

env = "sandbox"
if "staging" in stack or is_review_stack_or_template:
    env = "staging"

if "production" in stack:
    env = "production"

# ECR repository setup.
# Review stacks use a shared ECR repo managed by frontend-platform to avoid
# creating/destroying repos per PR and hitting RepositoryAlreadyExistsException.
# Non-review stacks create their own dedicated ECR repo as before.
docker_tag = config.require("docker_tag")
pulumi.info(f"Docker tag: {docker_tag}")

ecr_repo = None
if not is_review_stack_or_template:
    # Non-review stack: create a dedicated ECR repo.
    ecr_name = f"navigator-frontend-{theme}"
    ecr_repo = ECRRepository(
        ecr_name,
        config=ECRRepositoryConfig(image_scan_on_push=False),
    )
    repository_url = ecr_repo.repository.repository_url
    repository_url.apply(lambda url: pulumi.info(f"Repository URL: {url}"))
    image_identifier = ecr_repo.repository.repository_url.apply(
        lambda url: f"{url}:{docker_tag}"
    )
    image_identifier.apply(lambda id: pulumi.info(f"Final image identifier: {id}"))

    # Export the repository URL for use in CI/CD pipelines
    pulumi.export("ecr_repository_url", repository_url)

# Review stack: use the shared ECR repo from frontend-platform.
shared_resources_review_stack = pulumi.StackReference("climatepolicyradar/frontend-platform/staging")

review_ecr_url = None
frontend_image: docker_build.Image | None = None
if is_review_stack:
    review_ecr_url = shared_resources_review_stack.get_output("cpr_review_ecr_repository_url")

    # Build and push the Docker image as part of the Pulumi deployment so that
    # the App Runner service has a valid image to pull.
    ecr_auth = aws.ecr.get_authorization_token_output()
    frontend_image = docker_build.Image(
        f"review-{theme}-frontend-image",
        tags=[pulumi.Output.concat(review_ecr_url, ":", stack)],
        context=docker_build.BuildContextArgs(
            location="..",
        ),
        dockerfile=docker_build.DockerfileArgs(
            location="../Dockerfile",
        ),
        platforms=[docker_build.Platform.LINUX_AMD64],
        build_args={"THEME": theme},
        push=True,
        registries=[
            docker_build.RegistryArgs(
                address=review_ecr_url,
                username=ecr_auth.user_name,
                password=ecr_auth.password,
            ),
        ],
        # Skip building during preview to speed up PR feedback loops.
        build_on_preview=False,
    )

    # Use the tag-based identifier for App Runner (it doesn't support @digest refs).
    repository_url = review_ecr_url
    image_identifier = pulumi.Output.concat(review_ecr_url, ":", stack)
    pulumi.info(f"Repository URL: {review_ecr_url}")

    # Export the repository URL for use in CI/CD pipelines
    pulumi.export("ecr_repository_url", repository_url)


if ecr_repo:
    pulumi.export("ecr_repository_name", ecr_repo.repository.name)

shared_access_role_arn= None
if not is_review_template:
    # For review stacks, use the shared ECR access role created in frontend-platform
    # to avoid the 64-character IAM role name limit on ephemeral PR stacks.
    shared_access_role_arn = shared_resources_review_stack.get_output("apprunner_ecr_access_role_arn")

    # Configure AppRunner settings (using current account)
    is_cpr_stack = stack in ["cpr-production", "cpr-staging"]
    default_max_concurrency = 50
    default_max_instances = 10
    default_min_instances = 1
    apprunner_config = AppRunnerConfig(
        max_concurrency=int(
            config.require("apprunner_frontend_max_concurrency")
            if is_cpr_stack
            else default_max_concurrency
        ),
        max_instances=int(
            config.require("apprunner_frontend_max_instance_count")
            if is_cpr_stack
            else default_max_instances
        ),
        min_instances=int(
            config.require("apprunner_frontend_min_instance_count")
            if is_cpr_stack
            else default_min_instances
        ),
        auto_deploy=True,
    )

    # Create the frontend AppRunner service in current account
    name_prefix = review_name if review_name else tag_name()
    frontend = AppRunnerService(
        name=name_prefix,
        config=apprunner_config,
        image_identifier=cast(str, image_identifier),
        env_vars=FRONTEND_ENV,
        auto_scaling_config_arn=(
            config.require("auto_scaling_config_arn")
            if not is_cpr_stack
            else None
        ),
        access_role_arn=shared_access_role_arn,
        opts=pulumi.ResourceOptions(
            depends_on=(
                [frontend_image] if frontend_image is not None
                else [ecr_repo.repository] if ecr_repo
                else []
            ),
        ),
    )

    # Export outputs
    pulumi.export("frontend service name", frontend.service.service_name)
    pulumi.export("frontend arn", frontend.service.arn)
    pulumi.export("apprunner_service_url", frontend.service.service_url)

########################################################################
# Create old GitHub Actions role
########################################################################

# We only generate this for the CPR stacks as having a role for each app is overkill
stack = pulumi.get_stack()
if stack == "staging" or stack == "production":
    navigator_frontend_github_actions_role = aws.iam.Role(
        "navigator-frontend-github-actions",
        assume_role_policy=json.dumps(
            {
                "Statement": [
                    {
                        "Action": "sts:AssumeRoleWithWebIdentity",
                        "Condition": {
                            "StringEquals": {
                                "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                            },
                            "StringLike": {
                                "token.actions.githubusercontent.com:sub": "repo:climatepolicyradar/*"
                            },
                        },
                        "Effect": "Allow",
                        "Principal": {
                            "Federated": f"arn:aws:iam::{aws_account.account_id}:oidc-provider/token.actions.githubusercontent.com"
                        },
                    }
                ],
                "Version": "2012-10-17",
            }
        ),
        inline_policies=[
            {
                "name": "navigator-frontend-github-actions",
                "policy": json.dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Action": [
                                    # Most of these were taken from https://github.com/aws/aws-toolkit-azure-devops/issues/311#issuecomment-623871181
                                    "ecr:GetAuthorizationToken",
                                    "ecr:InitiateLayerUpload",
                                    "ecr:UploadLayerPart",
                                    "ecr:CompleteLayerUpload",
                                    "ecr:PutImage",
                                    "iam:PassRole",
                                    "ecr:DescribeRepositories",
                                    "ecr:CreateRepository",
                                    "ecr:BatchGetImage",
                                    "ecr:BatchCheckLayerAvailability",
                                    "ecr:DescribeImages",
                                    "ecr:GetDownloadUrlForLayer",
                                    "ecr:ListImages",
                                    "iam:ListAccountAliases",
                                ],
                                "Effect": "Allow",
                                "Resource": "*",
                            }
                        ],
                    }
                ),
            }
        ],
        name="navigator-frontend-github-actions",
        opts=pulumi.ResourceOptions(protect=True),
    )

########################################################################
# Create new GitHub Actions role
########################################################################

# Create GitHub Actions role only for CPR stacks (in current account)
if stack == "staging" or stack == "production":
    github_actions_role = GitHubActionsRole(
        name="navigator-new-frontend-github-actions",
    )

# ########################################################################
# # Create CloudFront policies & distribution
# ########################################################################
# Review stacks only need ECR + App Runner — skip CloudFront, DNS, and
# all downstream resources to keep ephemeral environments lightweight.
if not is_review_stack_or_template:
    CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2"  # CloudFront's fixed zone ID
    # See here https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-aliastarget.html#aws-properties-route53-recordset-aliastarget-properties
    # Create CORS policy
    cors_policy = CloudFrontCORSPolicy(
        CORSPolicyConfig(
            name=f"Navigator{theme.upper()}Frontend",
            comment=f"{theme.upper()} Frontend Origin Request Policy (no use of x-forwarded-host header)",
            headers=HeaderConfig(
                behaviour=BehaviourOptions.WHITELIST,
                items=[
                    "Origin",
                    "Accept",
                    "Access-Control-Request-Method",
                    "Access-Control-Request-Headers",
                ],
            ),
            cookies=CookieConfig(
                behaviour=BehaviourOptions.WHITELIST, items=["feature_flags"]
            ),
            query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
        ),
    )

    # Create cache policy
    cache_policy = CloudFrontCachePolicy(
        CachePolicyConfig(
            name=f"Navigator{theme.upper()}Frontend",
            comment=f"{theme.upper()} Frontend Cache Policy (no use of host header)",
            headers=HeaderConfig(
                behaviour=BehaviourOptions.WHITELIST, items=["Authorization", "Accept"]
            ),
            cookies=CookieConfig(
                behaviour=BehaviourOptions.WHITELIST, items=["feature_flags"]
            ),
            query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
        ),
    )


    ########################################################################
    # Create Route 53 records & certificate
    ########################################################################

    # TODO: we're only doing this on staging as it's an example of how we might use the aws_env stack
    # to get the zone id for the root domain
    #
    # we want to switch on the theme for the final domain names - but we're not doing
    # that yet.
    # if is_cpr_stack:
    #     domain_name = "climatepolicyradar.org"
    # elif theme == "cclw":
    #     domain_name = "climate-laws.org"
    # elif theme == "mcf":
    #     domain_name = "climateprojectexplorer.org"

    aws_env_stack = pulumi.StackReference(f"climatepolicyradar/aws_env/{env}")
    hosted_zone_id = aws_env_stack.get_output("root_zone_id")

    # First create the CloudFront distribution with the correct domain
    frontend_domain = f"{theme}.{env}.climatepolicyradar.org"

    dns_config = DNSConfig(
        domain=frontend_domain,
        zone_id=cast(str, hosted_zone_id),
        environment=env,
        certificate_type="CLOUDFRONT",
        subject_alternative_names=[],
    )

    dns = DNS(
        name=name_prefix,
        config=dns_config,
    )


    ########################################################################
    # Create CloudFront distribution
    ########################################################################

    # Get backend stack reference
    backend_stack = pulumi.StackReference(f"climatepolicyradar/backend/{env}")
    backend_service_url = backend_stack.get_output("new_apprunner_service_url")

    frontend.service.service_url.apply(
        lambda url: pulumi.info(f"Frontend app runner URL: {url}")
    )
    backend_service_url.apply(lambda url: pulumi.info(f"Backend app runner URL: {url}"))

    # Create origins for both frontend and API
    origins = [
        OriginConfig(
            origin_id="frontend",
            domain_name=cast(
                str,
                frontend.service.service_url.apply(
                    lambda url: cast(str, url).replace("https://", "")
                ),
            ),
        )
    ]

    ordered_cache_behaviors = None
    if is_cpr_stack:
        api_cache_policy = CloudFrontCachePolicy(
            CachePolicyConfig(
                name=f"Navigator{theme.upper()}FrontendAPI",
                comment=f"{theme.upper()} Frontend API Cache Policy",
                headers=HeaderConfig(
                    behaviour=BehaviourOptions.WHITELIST,
                    items=[
                        "Authorization",
                        "Accept",
                        # CORS headers
                        "Origin",
                        "Access-Control-Request-Method",
                        "Access-Control-Request-Headers",
                        # CPR access Headers
                        "app-token",
                    ],
                ),
                cookies=CookieConfig(
                    behaviour=BehaviourOptions.WHITELIST, items=["feature_flags"]
                ),
                query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
            ),
        )
        # Define ordered cache behaviors for API routes
        ordered_cache_behaviors = [
            {
                "allowed_methods": [
                    "GET",
                    "HEAD",
                    "OPTIONS",
                    "PUT",
                    "POST",
                    "PATCH",
                    "DELETE",
                ],
                "cached_methods": ["GET", "HEAD", "OPTIONS"],
                "cache_policy_id": api_cache_policy.policy.id,
                "compress": True,
                "path_pattern": "/api/tokens",
                "target_origin_id": "api",
                "viewer_protocol_policy": "redirect-to-https",
            },
            {
                "allowed_methods": [
                    "GET",
                    "HEAD",
                    "OPTIONS",
                    "PUT",
                    "POST",
                    "PATCH",
                    "DELETE",
                ],
                "cached_methods": ["GET", "HEAD", "OPTIONS"],
                "cache_policy_id": api_cache_policy.policy.id,
                "compress": True,
                "path_pattern": "/api/v1/*",
                "target_origin_id": "api",
                "viewer_protocol_policy": "redirect-to-https",
            },
        ]

        origins.append(
            OriginConfig(
                origin_id="api",
                domain_name=cast(
                    str,
                    backend_service_url.apply(
                        lambda url: cast(str, url).replace("https://", "")
                    ),
                ),
            )
        )


    # Create the CloudFront distribution
    class DomainVisibility(Enum):
        INTERNAL = "internal"
        EXTERNAL = "public facing"


    cf = CloudFrontDistribution(
        f"{theme.upper()}FrontendDistribution",
        DistributionType.FRONTEND,
        description=frontend_domain,
        aliases=[frontend_domain],
        origins=origins,
        cache_policy_id=cast(str, cache_policy.policy.id),
        acm_certificate=dns.certificate,
        origin_request_policy_id=cast(str, cors_policy.policy.id),
        ordered_cache_behaviors=ordered_cache_behaviors,
        # Needed for auto-invalidations to work, @related: CUSTOM_APP_THEME
        tags={
            "CUSTOM_APP_THEME": theme,
            "Environment": env,
            "Domain_Visibility": DomainVisibility.INTERNAL.value,
        },
    )

    # Create A record for apex domain
    dns.create_alias_record(
        name=frontend_domain,  # Changed: Use full domain name
        target_zone_id=CLOUDFRONT_ZONE_ID,
        target_dns_name=cast(str, cf.distribution.domain_name),
        record_type="A",
        evaluate_target_health=False,
    )

    cname = config.get("cname")
    if cname:
        # create a hosted zone
        cname_hosted_zone = aws.route53.Zone(
            cname,
            name=cname,
        )
        cname_dns_config = DNSConfig(
            domain=cname,
            zone_id=cast(str, cname_hosted_zone.id),
            environment=env,
            certificate_type="CLOUDFRONT",
            subject_alternative_names=[],
        )
        cname_dns = DNS(
            name=cname,
            config=cname_dns_config,
        )
        cname_cf = CloudFrontDistribution(
            cname,
            DistributionType.FRONTEND,
            description=cname,
            aliases=[cname],
            origins=origins,
            cache_policy_id=cast(str, cache_policy.policy.id),
            acm_certificate=cname_dns.certificate,
            origin_request_policy_id=cast(str, cors_policy.policy.id),
            ordered_cache_behaviors=ordered_cache_behaviors,
            # Needed for auto-invalidations to work, @related: CUSTOM_APP_THEME
            tags={
                "CUSTOM_APP_THEME": theme,
                "Environment": env,
                "Domain_Visibility": DomainVisibility.EXTERNAL.value,
            },
        )
        cname_route53_record = aws.route53.Record(
            f"{cname}-alias",
            zone_id=cast(str, cname_hosted_zone.id),
            name=cname,
            type="A",
            aliases=[
                aws.route53.RecordAliasArgs(
                    name=cast(str, cname_cf.distribution.domain_name),
                    zone_id=CLOUDFRONT_ZONE_ID,
                    evaluate_target_health=False,
                )
            ],
        )


    #######################################################################################
    # Create CCC redirects?
    #######################################################################################

    is_ccc_stack = stack in ["ccc-production"]
    if is_ccc_stack:
        # This certificate was imported, and the DNS validation was setup by our tech contact at Climate Case Chart
        east_provider = aws.Provider("east", region="us-east-1")
        climatecasechart_com_cert = aws.acm.Certificate(
            "climatecasechart.com",
            domain_name="climatecasechart.com",
            subject_alternative_names=[
                "cpr.climatecasechart.com",
                "*.climatecasechart.com",
            ],
            validation_method="DNS",
            opts=pulumi.ResourceOptions(
                provider=east_provider,
            ),
        )

        # We're going to create a KeyValueStore in CloudFront to store values of redirects
        # from the current CCC website to the new CPR frontend we are building for them.
        # We're going with this solution as it's meant to be incredibly low latency and
        # therefore should scale well. We catch the redirect rules right at the edge this
        # way, so changes are near-instant & we can update the redirects without having to
        # update code.
        redirection_cloudfront_key_value_store = aws.cloudfront.KeyValueStore(
            "ccc-redirection-kvs",
            name="ccc-redirection-kvs",
            comment="Redirects for CCC",
        )

        infra_dir = Path(__file__).parent.parent
        with open(infra_dir / "redirects.json", "r") as f:
            redirects: list[dict[str, str]] = json.load(f)["redirects"]

        # Get the code as a string for the CloudFront Function
        with open(infra_dir / "redirection.js", "r") as f:
            lambda_code = f.read()

        for redirect in redirects:
            aws.cloudfront.KeyvaluestoreKey(
                f"ccc-redirection-kvs-key-{redirect['Key']}",
                key_value_store_arn=redirection_cloudfront_key_value_store.arn,
                key=redirect["Key"],
                value=redirect["Value"],
            )

        redirection_lambda = aws.cloudfront.Function(
            "ccc-redirection",
            name="ccc-redirection",
            runtime="cloudfront-js-2.0",
            comment="climatecasechart.com redirection function",
            key_value_store_associations=[
                redirection_cloudfront_key_value_store.arn,
            ],
            code=lambda_code,
            opts=pulumi.ResourceOptions(
                provider=east_provider,
                depends_on=[redirection_cloudfront_key_value_store],
            ),
            publish=True,  # Make the function available to CloudFront.
        )

        redirection_cors_policy = CloudFrontCORSPolicy(
            CORSPolicyConfig(
                name="wordpress-redirection-cors-policy",
                comment="Wordpress redirection CORS policy",
                headers=HeaderConfig(
                    behaviour=BehaviourOptions.WHITELIST,
                    items=[
                        "Origin",
                        "Accept",
                        "Access-Control-Request-Method",
                        "Access-Control-Request-Headers",
                    ],
                ),
                cookies=CookieConfig(
                    behaviour=BehaviourOptions.WHITELIST, items=["feature_flags"]
                ),
                query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
            ),
        )

        redirection_cache_policy = CloudFrontCachePolicy(
            CachePolicyConfig(
                name="wordpress-redirection-cache-policy",
                comment="Wordpress redirection cache policy",
                headers=HeaderConfig(
                    behaviour=BehaviourOptions.WHITELIST,
                    items=["Authorization", "Accept", "Origin"],
                ),
                cookies=CookieConfig(
                    behaviour=BehaviourOptions.WHITELIST, items=["feature_flags"]
                ),
                query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
            ),
        )

        redirection_cloudfront_distribution = CloudFrontDistribution(
            name="www.climatecasechart.com",
            dist_type=DistributionType.FRONTEND,
            description="www.climatecasechart.com",
            aliases=[
                "preview.climatecasechart.com",
                "www.climatecasechart.com",
            ],
            cache_policy_id=cast(str, redirection_cache_policy.policy.id),
            acm_certificate=climatecasechart_com_cert,
            origin_request_policy_id=cast(str, redirection_cors_policy.policy.id),
            origins=[
                OriginConfig(
                    origin_id="cpr-frontend",
                    domain_name=cast(
                        str,
                        frontend.service.service_url.apply(
                            lambda url: cast(str, url).replace("https://", "")
                        ),
                    ),
                ),
            ],
            ordered_cache_behaviors=[],
            default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
                target_origin_id="cpr-frontend",
                viewer_protocol_policy="redirect-to-https",
                allowed_methods=["GET", "HEAD"],
                cached_methods=["GET", "HEAD"],
                origin_request_policy_id=cast(str, redirection_cors_policy.policy.id),
                cache_policy_id=cast(str, redirection_cache_policy.policy.id),
                function_associations=[
                    aws.cloudfront.DistributionDefaultCacheBehaviorFunctionAssociationArgs(
                        event_type="viewer-request",
                        function_arn=redirection_lambda.arn,
                    ),
                ],
            ),
            # These are used for cache invalidations
            tags={"CUSTOM_APP_THEME": "ccc", "Environment": "production"},
        )
