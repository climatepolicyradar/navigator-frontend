"""S3 bucket holding each deploy's Next.js /_next/static output.

Objects are content-hashed by webpack, so successive builds accumulate rather
than overwrite: a client still running an old build can keep fetching its own
chunks after a newer task has replaced the container that served them.

Keys mirror the request path (`_next/static/...`) because CloudFront asks the
origin for the path verbatim. A lifecycle rule expires objects so the bucket
doesn't grow forever -- note S3 expiry is by object age, not last access, so the
window must comfortably exceed the longest expected gap between deploys.
"""

from collections.abc import Sequence
from dataclasses import dataclass

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


@dataclass
class NextStaticBucketConfig:
    """Configuration for the /_next/static asset bucket."""

    # Days to retain a build's assets. Must exceed the longest expected gap
    # between deploys -- expiry is by object age, so a quiet month would
    # otherwise delete the live build's assets.
    expiration_days: int = 30


class NextStaticBucket(pulumi.ComponentResource):
    """
    A component resource for the bucket serving /_next/static/*.

    :param name: The unique name for this component
    :type name: str
    :param bucket_name: Explicit bucket name, so CI can construct it without a
        stack output
    :type bucket_name: str
    :param config: Configuration for the bucket
    :type config: NextStaticBucketConfig
    :param tags: Resource tags
    :type tags: dict[str, str] | None
    :param opts: Resource options
    :type opts: pulumi.ResourceOptions | None
    """

    def __init__(
        self,
        name: str,
        bucket_name: str,
        config: NextStaticBucketConfig,
        tags: dict[str, str] | None = None,
        opts: pulumi.ResourceOptions | None = None,
    ):

        super().__init__("cpr:s3:NextStaticBucket", name, None, opts)

        # Set default tags first, then extend/override with user tags if provided
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": tag_name(),
        }
        self.tags = default_tags | (tags or {})

        self.bucket = aws.s3.Bucket(
            f"{name}-next-static",
            bucket=bucket_name,
            tags=self.tags,
            opts=pulumi.ResourceOptions.merge(
                pulumi.ResourceOptions(parent=self, protect=True),
                opts or pulumi.ResourceOptions(),
            ),
        )

        aws.s3.BucketLifecycleConfiguration(
            f"{name}-next-static-lifecycle",
            bucket=self.bucket.id,
            rules=[
                aws.s3.BucketLifecycleConfigurationRuleArgs(
                    id="expire-old-builds",
                    status="Enabled",
                    filter=aws.s3.BucketLifecycleConfigurationRuleFilterArgs(
                        prefix="",
                    ),
                    expiration=aws.s3.BucketLifecycleConfigurationRuleExpirationArgs(
                        days=config.expiration_days,
                    ),
                )
            ],
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.oac = aws.cloudfront.OriginAccessControl(
            f"{name}-next-static-oac",
            origin_access_control_origin_type="s3",
            signing_behavior="always",
            signing_protocol="sigv4",
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.register_outputs(
            {
                "bucket_name": self.bucket.id,
                "bucket_arn": self.bucket.arn,
                "bucket_regional_domain_name": self.bucket.bucket_regional_domain_name,
                "oac_id": self.oac.id,
            }
        )

    def allow_distribution_read(
        self, distribution_arns: Sequence[pulumi.Input[str]]
    ) -> None:
        """Grant the given CloudFront distributions read access via OAC.

        Called once, after every distribution that needs to read the bucket
        exists, so the policy can be conditioned on their ARNs -- without that
        condition any CloudFront distribution in any account could read it.

        Takes all ARNs together because S3 permits only one bucket policy: the
        themes with a `cname` serve the same assets from a second, public-facing
        distribution, and both must be listed here or that domain gets a 403 on
        every asset.

        :param distribution_arns: ARNs of the distributions allowed to read
        :type distribution_arns: Sequence[pulumi.Input[str]]
        """
        aws.s3.BucketPolicy(
            f"{self._name}-next-static-policy",
            bucket=self.bucket.id,
            # Resolved inside an apply because GetPolicyDocument*Args are invoke
            # arg types declared with plain str, not Input[str].
            policy=pulumi.Output.all(self.bucket.arn, *distribution_arns).apply(
                lambda args: aws.iam.get_policy_document(
                    statements=[
                        aws.iam.GetPolicyDocumentStatementArgs(
                            effect="Allow",
                            principals=[
                                aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                                    type="Service",
                                    identifiers=["cloudfront.amazonaws.com"],
                                )
                            ],
                            actions=["s3:GetObject"],
                            resources=[f"{args[0]}/*"],
                            conditions=[
                                aws.iam.GetPolicyDocumentStatementConditionArgs(
                                    test="StringEquals",
                                    variable="AWS:SourceArn",
                                    values=list(args[1:]),
                                )
                            ],
                        ),
                    ]
                ).json
            ),
            opts=pulumi.ResourceOptions(parent=self),
        )
