"""Manages IAM deployment roles, ESC environments, and deployment settings
for the frontend project.

These resources are managed as IaC to ensure all credential configuration
is version-controlled and PR-reviewed.

The OIDC Identity Provider (api.pulumi.com/oidc) is managed in the aws_env
project in navigator-infra. Its ARN is referenced via a StackReference.
"""

import json
from typing import cast

import pulumi
import pulumi_aws as aws
import pulumi_pulumiservice as pulumiservice

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
config = pulumi.Config()
org_name = "climatepolicyradar"
project_name = "frontend"
aws_account = aws.get_caller_identity()

# ---------------------------------------------------------------------------
# OIDC Identity Provider (managed in aws_env, referenced here)
# ---------------------------------------------------------------------------
aws_env_stack = pulumi.StackReference(f"{org_name}/aws_env/staging")
oidc_provider_arn = cast(str, aws_env_stack.get_output("staging-oidc-provider-arn"))

# ---------------------------------------------------------------------------
# IAM Role for Pulumi Deployments (staging frontend)
# ---------------------------------------------------------------------------
# This role is assumed by Pulumi Deployments and ESC environments to manage
# frontend staging infrastructure. The trust policy allows both:
# - Pulumi Deployments (pulumi:deploy:...) for inline OIDC
# - Pulumi ESC environments (pulumi:environments:...) for dynamic credentials
staging_deployment_role = aws.iam.Role(
    "staging-frontend-pulumi-oidc-deployment-role",
    name="staging-frontend-pulumi-oidc-deployment-role",
    description=(
        "Role for Pulumi Deployments and ESC to manage frontend staging "
        "infrastructure via OIDC."
    ),
    assume_role_policy=pulumi.Output.from_input(oidc_provider_arn).apply(
        lambda provider_arn: json.dumps(
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Federated": provider_arn},
                        "Action": "sts:AssumeRoleWithWebIdentity",
                        "Condition": {
                            "StringLike": {
                                "api.pulumi.com/oidc:aud": [
                                    org_name,
                                    f"aws:{org_name}",
                                ],
                                "api.pulumi.com/oidc:sub": [
                                    f"pulumi:deploy:org:{org_name}:project:{project_name}:*",
                                    f"pulumi:environments:org:{org_name}:env:{project_name}/*",
                                ],
                            }
                        },
                    }
                ],
            }
        )
    ),
    max_session_duration=3600,
    opts=pulumi.ResourceOptions(protect=True),
)

# Attach AdministratorAccess (matches current configuration)
staging_deployment_role_policy = aws.iam.RolePolicyAttachment(
    "staging-deployment-role-admin-policy",
    role=staging_deployment_role.name,
    policy_arn="arn:aws:iam::aws:policy/AdministratorAccess",
)
pulumi.export("staging_deployment_role_arn", staging_deployment_role.arn)

# ---------------------------------------------------------------------------
# Shared App Runner ECR Access Role
# ---------------------------------------------------------------------------
# A single IAM role that grants App Runner permission to pull images from ECR.
# This is shared across all frontend stacks (especially ephemeral PR review
# stacks) to avoid per-stack role creation and the 64-character IAM name limit.
apprunner_ecr_access_role = aws.iam.Role(
    "shared-apprunner-ecr-access-role",
    description=(
        "Shared role for App Runner services to pull images from ECR. "
        "Used by all frontend stacks including ephemeral PR review stacks."
    ),
    assume_role_policy=json.dumps(
        {
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
    ),
    max_session_duration=3600,
)

apprunner_ecr_access_policy = aws.iam.Policy(
    "shared-apprunner-ecr-access-policy",
    description="Grants ECR read access for App Runner services.",
    policy=json.dumps(
        {
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
    ),
)

aws.iam.RolePolicyAttachment(
    "shared-apprunner-ecr-role-policy-attachment",
    role=apprunner_ecr_access_role.name,
    policy_arn=apprunner_ecr_access_policy.arn,
)

pulumi.export("apprunner_ecr_access_role_arn", apprunner_ecr_access_role.arn)

# ---------------------------------------------------------------------------
# Shared ECR Repository for Review Stacks
# ---------------------------------------------------------------------------
# A single ECR repository shared by all ephemeral PR review stacks of that theme. Each
# PR pushes its image with a branch-specific tag (e.g. the PR number or branch
# name) so images don't collide. This avoids creating/destroying ECR repos
# per PR stack and prevents RepositoryAlreadyExistsException errors.
for theme in ["cpr", "cclw", "mcf", "ccc"]:
    review_ecr_repo = aws.ecr.Repository(
        f"review-navigator-frontend-{theme}",
        name=f"review-navigator-frontend-{theme}",
        image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
            scan_on_push=False,
        ),
        image_tag_mutability="MUTABLE",
        opts=pulumi.ResourceOptions(
            protect=True,
        ),
    )
    pulumi.export(f"{theme}_review_ecr_repository_url", review_ecr_repo.repository_url)

# ---------------------------------------------------------------------------
# ESC Environments
# ---------------------------------------------------------------------------
# Environment YAML is generated dynamically so that sensitive values (like
# the AWS account ID in the role ARN) never appear in committed source files.

# Shared AWS credentials environment - provides dynamic OIDC credentials
# for all frontend staging deployments (including review stacks).
# The role ARN is interpolated at deploy time from the IAM role output.
aws_creds_staging_yaml = staging_deployment_role.arn.apply(
    lambda role_arn: (
        "values:\n"
        "  aws:\n"
        "    login:\n"
        "      fn::open::aws-login:\n"
        "        oidc:\n"
        f"          roleArn: {role_arn}\n"
        "          sessionName: pulumi-frontend-deployments\n"
        "          duration: 1h\n"
        "  environmentVariables:\n"
        "    AWS_ACCESS_KEY_ID: ${aws.login.accessKeyId}\n"
        "    AWS_SECRET_ACCESS_KEY: ${aws.login.secretAccessKey}\n"
        "    AWS_SESSION_TOKEN: ${aws.login.sessionToken}\n"
        "    AWS_REGION: eu-west-1\n"
    )
)

aws_creds_staging_env = pulumiservice.Environment(
    "aws-creds-staging",
    organization=org_name,
    project=project_name,
    name="aws-creds-staging",
    yaml=aws_creds_staging_yaml.apply(lambda y: pulumi.StringAsset(y)),
)

# Review stack environment - imports aws-creds-staging and provides
# stack-specific config for the cpr-review stack and its PR stacks.
# The DEPLOY_* environment variables are set here (rather than in
# DeploymentSettings) so that PR review stacks automatically inherit them
# via the shared ESC environment.
cpr_review_yaml = pulumi.Output.all(
    apprunner_ecr_access_role.arn,
).apply(
    lambda args: (
        "imports:\n"
        f"  - {project_name}/aws-creds-staging\n"
        "\n"
        "values:\n"
        "  pulumiConfig:\n"
        "    docker_tag: ${docker_tag}\n"
        f"    frontend:apprunner_ecr_access_role_arn: {args[0]}\n"
        "  docker_tag: latest\n"
        "  environmentVariables:\n"
        "    DEPLOY_FROM_MAIN_BRANCH_ONLY: 'false'\n"
        "    DEPLOY_TO_PROD_STACK_ALLOWED: 'false'\n"
    )
)

cpr_review_env = pulumiservice.Environment(
    "cpr-review",
    organization=org_name,
    project=project_name,
    name="cpr-review",
    yaml=cpr_review_yaml.apply(lambda y: pulumi.StringAsset(y)),
    opts=pulumi.ResourceOptions(depends_on=[aws_creds_staging_env]),
)

# ---------------------------------------------------------------------------
# Deployment Settings for cpr-review stack
# ---------------------------------------------------------------------------
# Manages the deployment settings for the cpr-review stack, which serves as
# the template for PR review stacks. Credentials come from ESC (via the
# cpr-review environment), not from inline OIDC.
for theme in ["cpr", "cclw", "mcf", "ccc"]:
    deployment_settings = pulumiservice.DeploymentSettings(
        f"{theme}-review-deployment-settings",
        organization=org_name,
        project=project_name,
        stack=f"{theme}-review",
        source_context=pulumiservice.DeploymentSettingsSourceContextArgs(
            git=pulumiservice.DeploymentSettingsGitSourceArgs(
                branch="main",
                repo_dir="infra",
            ),
        ),
        vcs=pulumiservice.DeploymentSettingsVcsArgs(
            provider="github",
            repository="climatepolicyradar/navigator-frontend",
            pull_request_template=False,
            deploy_commits=False,
            preview_pull_requests=False,
        ),
        operation_context=pulumiservice.DeploymentSettingsOperationContextArgs(
            # DEPLOY_FROM_MAIN_BRANCH_ONLY and DEPLOY_TO_PROD_STACK_ALLOWED are
            # now provided via the cpr-review ESC environment so that PR review
            # stacks inherit them automatically.
            options=pulumiservice.OperationContextOptionsArgs(
                skip_intermediate_deployments=True,
            ),
        ),
    )
