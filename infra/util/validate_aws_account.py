import os
import subprocess

import pulumi
import pulumi_aws as aws


def convert_str_to_bool(s: str) -> bool:
    """Convert a string to a boolean."""
    s = s.lower()
    if s == "true":
        return True
    elif s == "false":
        return False
    else:
        raise ValueError(f"Cannot convert string {s} to bool.")


def validate_aws_account() -> None:
    """Enforce AWS account."""
    config = pulumi.Config()

    expected_account_id = config.require("validation_account_id")
    deploy_identity = aws.get_caller_identity()

    if expected_account_id != deploy_identity.account_id:
        raise RuntimeError(
            "The AWS credentials in use do not match the expected account ID."
        )


def get_active_branch() -> str:
    """Get the active branch of the repository."""
    return (
        subprocess.run(
            [
                "git",
                "branch",
                "--show-current",
            ],
            capture_output=True,
        )
        .stdout.decode("utf-8")
        .split("\n")[0]
    )


def is_branch_dirty() -> bool:
    """
    Check if the current branch has uncommitted changes.

    If we are running in a GitHub Actions runner ignore uncommitted changes.
    """
    if os.path.exists("/home/runner"):
        return False
    return (
        subprocess.run(
            ["git", "status", "--porcelain"], capture_output=True
        ).stdout.decode("utf-8")
        != ""
    )


def validate_stack_and_branch() -> None:
    """
    Validate that the stack and branch are correct for the current deployment.

    This is to prevent accidental deployments to the wrong environment and from the wrong branch.
    """
    stack = pulumi.get_stack()
    branch = get_active_branch()
    deployment_branch = "main"

    deploy_from_main_branch_only = convert_str_to_bool(
        os.getenv("DEPLOY_FROM_MAIN_BRANCH_ONLY", "True")
    )
    deploy_to_prod_stack_allowed = convert_str_to_bool(
        os.getenv("DEPLOY_TO_PROD_STACK_ALLOWED", "False")
    )

    if deploy_from_main_branch_only and is_branch_dirty():
        raise RuntimeError("The current branch has uncommitted changes.\n\n")


    if stack in ["production", "cclw-production"]:
        if not deploy_to_prod_stack_allowed:
            raise RuntimeError(
                f"Deploying to the '{stack}' stack is not allowed.\n\n"
                f"Set the environment variable 'DEPLOY_TO_PROD_STACK_ALLOWED' to 'True' in the pulumi command to allow "
                f"it.\n\n "
            )
        if branch != deployment_branch:
            raise RuntimeError(
                f"The stack '{stack}' is only deployable from the '{deployment_branch}' branch.\n\n"
            )

    elif stack in ["staging", "cclw-staging"]:
        if deploy_from_main_branch_only and branch != deployment_branch:
            raise RuntimeError(
                f"The stack '{stack}' is only deployable from the '{deployment_branch}'. Set the environment "
                f"variable 'DEPLOY_FROM_MAIN_BRANCH_ONLY' to 'False' in the pulumi command to allow it.\n\n"
            )

    elif stack in ["sandbox"]:
        pass
    else:
        raise RuntimeError(f"The stack '{stack}' is not a valid stack.\n\n")
