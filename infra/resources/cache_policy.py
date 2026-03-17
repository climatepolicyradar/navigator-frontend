from dataclasses import dataclass
from typing import Any, Dict, Optional

import pulumi
import pulumi_aws as aws

from resources.util import (
    BehaviourOptions,
    CookieConfig,
    HeaderConfig,
    QueryStringConfig,
)


@dataclass
class CachePolicyConfig:
    """Configuration for CloudFront cache policy."""

    name: str
    comment: str
    headers: HeaderConfig
    cookies: CookieConfig
    query_strings: QueryStringConfig
    default_ttl: int = 86400  # 24 hours
    min_ttl: int = 1
    max_ttl: int = 31536000  # 1 year


class CloudFrontCachePolicy(pulumi.ComponentResource):
    """
    A component resource for creating CloudFront cache policies with standardised
    configurations.

    :param name: The unique name for this cache policy
    :type name: str
    :param config: Configuration for the cache policy
    :type config: CachePolicyConfig
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        config: CachePolicyConfig,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):

        super().__init__(
            "cpr:cloudfront:CloudFrontCachePolicy", config.name, None, opts
        )

        self.policy = self._create_policy(config, opts)

        self.register_outputs(
            {
                "id": self.policy.id,
                "etag": self.policy.etag,
            }
        )

    def _build_policy_config(self, config: CachePolicyConfig) -> Dict[str, Any]:
        headers_config = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginHeadersConfigArgs(
            header_behavior=config.headers.behaviour.value,
        )
        if (
            config.headers.behaviour == BehaviourOptions.WHITELIST
            and config.headers.items
        ):
            headers_config.headers = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginHeadersConfigHeadersArgs(
                items=config.headers.items,
            )

        cookies_config = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginCookiesConfigArgs(
            cookie_behavior=config.cookies.behaviour.value,
        )
        if (
            config.cookies.behaviour == BehaviourOptions.WHITELIST
            and config.cookies.items
        ):
            cookies_config.cookies = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginCookiesConfigCookiesArgs(
                items=config.cookies.items,
            )

        query_strings_config = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginQueryStringsConfigArgs(
            query_string_behavior=config.query_strings.behaviour.value,
        )
        if (
            config.query_strings.behaviour == BehaviourOptions.WHITELIST
            and config.query_strings.items
        ):
            query_strings_config.query_strings = aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginQueryStringsConfigQueryStringsArgs(
                items=config.query_strings.items,
            )

        return {
            "comment": config.comment,
            "name": f"{config.name}CachePolicy",
            "default_ttl": config.default_ttl,
            "min_ttl": config.min_ttl,
            "max_ttl": config.max_ttl,
            "parameters_in_cache_key_and_forwarded_to_origin": aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginArgs(
                enable_accept_encoding_gzip=True,
                enable_accept_encoding_brotli=True,
                headers_config=headers_config,
                cookies_config=cookies_config,
                query_strings_config=query_strings_config,
            ),
        }

    def _create_policy(
        self, config: CachePolicyConfig, opts: Optional[pulumi.ResourceOptions] = None
    ) -> aws.cloudfront.CachePolicy:
        # Allow user options to override our defaults.
        resource_opts = pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(parent=self, protect=True),
            opts or pulumi.ResourceOptions(),
        )
        return aws.cloudfront.CachePolicy(
            f"{config.name}-cache-policy",
            **self._build_policy_config(config),
            opts=resource_opts,
        )
