"""Utility functions for naming things."""
import pulumi


def tag_string():
    """Create the default tag string to be used for any resource."""
    target_environment = pulumi.get_stack()
    project = pulumi.get_project()

    return f"{target_environment}-{project}"


NAME_PREFIX = tag_string()
SCALING_NAME="sc"

DEFAULT_TAGS = {
    "CPR-Created-By": "pulumi",
    "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
    "CPR-Pulumi-Project-Name": pulumi.get_project(),
    "CPR-Tag": NAME_PREFIX,
    "map-migrated": "mig46666",
}
