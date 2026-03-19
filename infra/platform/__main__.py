"""Manages OIDC identity provider, IAM deployment roles, ESC environments,
and deployment settings for the frontend project.

These resources are managed as IaC to ensure all credential configuration
is version-controlled and PR-reviewed.
"""

import json
from pathlib import Path

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
# OIDC Identity Provider for Pulumi Cloud
# ---------------------------------------------------------------------------
# This allows Pulumi Cloud (Deployments and ESC) to authenticate with AWS
# via OIDC. The provider is an account-level resource shared across projects.
pulumi_oidc_provider = aws.iam.OpenIdConnectProvider(
    "pulumi-cloud-oidc-provider",
    url="https://api.pulumi.com/oidc",
    client_id_lists=[
        # Used by Pulumi Deployments (inline OIDC in deployment settings)
        org_name,
        # Used by Pulumi ESC (aws-login provider)
        f"aws:{org_name}",
    ],
    thumbprint_lists=["06b25927c42a721631c1efd9431e648fa62e1e39"],
    opts=pulumi.ResourceOptions(
        import_="arn:aws:iam::073457443605:oidc-provider/api.pulumi.com/oidc",
        protect=True,
    ),
)

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
    assume_role_policy=pulumi_oidc_provider.arn.apply(
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
    opts=pulumi.ResourceOptions(
        import_="staging-frontend-pulumi-oidc-deployment-role",
        protect=True,
    ),
)

# Attach AdministratorAccess (matches current configuration)
staging_deployment_role_policy = aws.iam.RolePolicyAttachment(
    "staging-deployment-role-admin-policy",
    role=staging_deployment_role.name,
    policy_arn="arn:aws:iam::aws:policy/AdministratorAccess",
    opts=pulumi.ResourceOptions(
        import_=(
            "staging-frontend-pulumi-oidc-deployment-role/"
            "arn:aws:iam::aws:policy/AdministratorAccess"
        ),
    ),
)

# ---------------------------------------------------------------------------
# ESC Environments
# ---------------------------------------------------------------------------
# Environment definitions are stored as YAML files in the esc/ directory
# so they are version-controlled and changes require PR review.
esc_dir = Path(__file__).parent / "esc"

# Shared AWS credentials environment - provides dynamic OIDC credentials
# for all frontend staging deployments (including review stacks).
aws_creds_staging_env = pulumiservice.Environment(
    "aws-creds-staging",
    organization=org_name,
    project=project_name,
    name="aws-creds-staging",
    yaml=pulumi.FileAsset(str(esc_dir / "aws-creds-staging.yaml")),
    opts=pulumi.ResourceOptions(
        import_=f"{org_name}/{project_name}/aws-creds-staging",
    ),
)

# Review stack environment - imports aws-creds-staging and provides
# stack-specific config for the cpr-review stack and its PR stacks.
cpr_review_env = pulumiservice.Environment(
    "cpr-review",
    organization=org_name,
    project=project_name,
    name="cpr-review",
    yaml=pulumi.FileAsset(str(esc_dir / "cpr-review.yaml")),
    opts=pulumi.ResourceOptions(
        import_=f"{org_name}/{project_name}/cpr-review",
        depends_on=[aws_creds_staging_env],
    ),
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
        preview_pull_requests=False,
    ),
    operation_context=pulumiservice.DeploymentSettingsOperationContextArgs(
        options=pulumiservice.OperationContextOptionsArgs(
            skip_intermediate_deployments=True,
        ),
    ),
    opts=pulumi.ResourceOptions(
        import_=f"{org_name}/{project_name}/cpr-review",
    ),
)

# ---------------------------------------------------------------------------
# Exports
# ---------------------------------------------------------------------------
pulumi.export("oidc_provider_arn", pulumi_oidc_provider.arn)
pulumi.export("staging_deployment_role_arn", staging_deployment_role.arn)
