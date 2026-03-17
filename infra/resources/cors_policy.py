from dataclasses import dataclass
from typing import Any, Dict, Optional

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore

from resources.util import (
    CookieConfig,
    HeaderConfig,
    QueryStringConfig,
    build_origin_request_policy_config,
)


@dataclass
class CORSPolicyConfig:
    """Configuration for CloudFront CORS policy."""

    name: str
    comment: str
    headers: HeaderConfig
    cookies: CookieConfig
    query_strings: QueryStringConfig


class CloudFrontCORSPolicy(pulumi.ComponentResource):
    """
    A component resource for creating CloudFront CORS policies with standardised
    configurations.

    :param name: The unique name for this CORS policy
    :type name: str
    :param config: Configuration for the CORS policy
    :type config: CORSPolicyConfig
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        config: CORSPolicyConfig,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):

        super().__init__("cpr:cloudfront:CloudFrontCORSPolicy", config.name, None, opts)

        self.policy = self._create_policy(config, opts)

        self.register_outputs(
            {
                "id": self.policy.id,
                "etag": self.policy.etag,
                "name": self.policy.name,
            }
        )

    def _build_policy_config(self, config: CORSPolicyConfig) -> Dict[str, Any]:
        return {
            "comment": config.comment,
            "name": f"{config.name}CORSPolicy",
            **build_origin_request_policy_config(
                headers=config.headers,
                cookies=config.cookies,
                query_strings=config.query_strings,
            ),
        }

    def _create_policy(
        self, config: CORSPolicyConfig, opts: Optional[pulumi.ResourceOptions] = None
    ) -> aws.cloudfront.OriginRequestPolicy:
        # Allow user options to override our defaults.
        resource_opts = pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
        return aws.cloudfront.OriginRequestPolicy(
            f"{config.name}-cors-policy",
            **self._build_policy_config(config),
            opts=resource_opts,
        )
