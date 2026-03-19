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
CPR_REVIEW_YAML = (
    "imports:\n"
    f"  - {project_name}/aws-creds-staging\n"
    "\n"
    "values:\n"
    "  pulumiConfig:\n"
    "    docker_tag: ${docker_tag}\n"
    "  docker_tag: latest\n"
)

cpr_review_env = pulumiservice.Environment(
    "cpr-review",
    organization=org_name,
    project=project_name,
    name="cpr-review",
    yaml=pulumi.StringAsset(CPR_REVIEW_YAML),
    opts=pulumi.ResourceOptions(depends_on=[aws_creds_staging_env]),
)

# ---------------------------------------------------------------------------
# Deployment Settings for cpr-review stack
# ---------------------------------------------------------------------------
# Manages the deployment settings for the cpr-review stack, which serves as
# the template for PR review stacks. Credentials come from ESC (via the
# cpr-review environment), not from inline OIDC.
cpr_review_deployment_settings = pulumiservice.DeploymentSettings(
    "cpr-review-deployment-settings",
    organization=org_name,
    project=project_name,
    stack="cpr-review",
    source_context=pulumiservice.DeploymentSettingsSourceContextArgs(
        git=pulumiservice.DeploymentSettingsGitSourceArgs(
            branch="main",
            repo_dir="infra",
        ),
    ),
    vcs=pulumiservice.DeploymentSettingsVcsArgs(
        provider="github",
        repository="climatepolicyradar/navigator-frontend",
        pull_request_template=True,
        deploy_commits=False,
        preview_pull_requests=True,
    ),
    operation_context=pulumiservice.DeploymentSettingsOperationContextArgs(
        environment_variables={
            "DEPLOY_FROM_MAIN_BRANCH_ONLY": "false",
            "DEPLOY_TO_PROD_STACK_ALLOWED": "false",
        },
        options=pulumiservice.OperationContextOptionsArgs(
            skip_intermediate_deployments=True,
        ),
    ),
)

# ---------------------------------------------------------------------------
# Exports
# ---------------------------------------------------------------------------
pulumi.export("staging_deployment_role_arn", staging_deployment_role.arn)
