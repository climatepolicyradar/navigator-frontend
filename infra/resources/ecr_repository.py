"""Component resource for ECR repository creation."""

from dataclasses import dataclass

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


@dataclass
class ECRRepositoryConfig:
    image_scan_on_push: bool = True
    image_tag_mutability: str = "MUTABLE"


class ECRRepository(pulumi.ComponentResource):
    """A component resource for creating an ECR repository with proper permissions.

    :param name: Unique name for the component
    :type name: str
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        name: str,
        config: ECRRepositoryConfig,
        tags: dict[str, str] | None = None,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("pkg:index:ECRRepository", name, None, opts)
        self._name = name
        self._name_prefix = tag_name()

        # Set default tags first, then extend/override with user tags if provided
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": self._name_prefix,
        }

        # If user provided tags, update defaults with them (user tags take precedence)
        self.tags = default_tags | (tags or {})

        # Create ECR Repository
        self.repository = self._create_ecr_repo(config, opts)

        self.register_outputs(
            {
                "repository_url": self.repository.repository_url,
                "repository_arn": self.repository.arn,
            }
        )

    def _create_ecr_repo(
        self, config: ECRRepositoryConfig, opts: pulumi.ResourceOptions | None = None
    ) -> aws.ecr.Repository:
        # Allow user options to override our defaults.
        resource_opts = pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
        return aws.ecr.Repository(
            self._name,
            name=self._name,
            image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
                scan_on_push=config.image_scan_on_push,
            ),
            image_tag_mutability=config.image_tag_mutability,
            opts=resource_opts,
        )
