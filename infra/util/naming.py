"""Utility functions for naming things."""

import pulumi


def tag_name():
    """Create the default tag name to be used for any resource."""
    target_environment = pulumi.get_stack()
    project = pulumi.get_project()

    return f"{target_environment}-{project}"


SCALING_NAME = "sc"
NAME_PREFIX = tag_name()
DEFAULT_TAGS = {
    "CPR-Created-By": "pulumi",
    "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
    "CPR-Pulumi-Project-Name": pulumi.get_project(),
    "CPR-Tag": NAME_PREFIX,
}
