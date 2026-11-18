"""Component resource for ECR repository creation.

Deploys push two tags per build: the commit SHA and `latest` (see the
deploy workflows). The SHA tag is what a rollback names, so retention is
by image *count* rather than age -- an age rule would delete the only
images worth rolling back to during a quiet period, exactly when the
last known-good build is furthest in the past.
"""

import json
from dataclasses import dataclass

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


@dataclass
class ECRRepositoryConfig:
    image_scan_on_push: bool = True
    image_tag_mutability: str = "MUTABLE"
    # How many SHA-tagged builds to keep. Each is a rollback target, so this
    # is the depth of deploy history a rollback can still reach. Counted per
    # repository, and each theme has its own.
    retained_image_count: int = 50


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
        self._create_lifecycle_policy(config)

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

    def _create_lifecycle_policy(self, config: ECRRepositoryConfig) -> None:
        """Expire old images so SHA tags don't accumulate without bound.

        Keeps the newest N images -- the rollback window -- and expires the
        rest, including the untagged layers left behind when `latest` moves to
        a newer build. The live build is always among the newest, and `latest`
        points at an image that also carries a SHA tag, so neither is at risk.
        """
        policy = {
            "rules": [
                {
                    "rulePriority": 1,
                    "description": (
                        "Keep the most recent tagged builds as rollback targets."
                    ),
                    "selection": {
                        "tagStatus": "any",
                        "countType": "imageCountMoreThan",
                        "countNumber": config.retained_image_count,
                    },
                    "action": {"type": "expire"},
                },
            ]
        }

        aws.ecr.LifecyclePolicy(
            f"{self._name}-lifecycle-policy",
            repository=self.repository.name,
            policy=json.dumps(policy),
            opts=pulumi.ResourceOptions(parent=self),
        )
