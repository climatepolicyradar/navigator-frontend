from dataclasses import dataclass
from enum import Enum
from typing import Any, Dict, List, Optional, cast

import pulumi
import pulumi_aws as aws

from resources.util import tag_name


class DistributionType(Enum):
    """Enum for different types of CloudFront distributions we support."""

    FRONTEND = "frontend"
    API = "api"
    CDN = "cdn"


@dataclass
class OriginConfig:
    """Configuration for a CloudFront origin."""

    domain_name: str
    origin_id: str
    origin_path: str = ""
    custom_headers: Optional[Dict[str, str]] = None
    connection_timeout: int = 10
    read_timeout: int = 30
    keepalive_timeout: int = 5


class CloudFrontDistribution(pulumi.ComponentResource):
    """
    A component resource for creating CloudFront distributions with our standard
    configurations.

    :param name: The unique name for this distribution
    :type name: str
    :param dist_type: The type of distribution (frontend, api, or cdn)
    :type dist_type: DistributionType
    :param aliases: List of domain aliases for the distribution
    :type aliases: List[str]
    :param origins: List of origin configurations
    :type origins: List[OriginConfig]
    :param cache_policy_id: ID of the cache policy to use
    :type cache_policy_id: str
    :param origin_request_policy_id: ID of the origin request policy to use
    :type origin_request_policy_id: Optional[str]
    :param ordered_cache_behaviors: List of ordered cache behaviors
    :type ordered_cache_behaviors: Optional[List[Dict[str, Any]]]
    :param tags: Resource tags
    :type tags: Optional[Dict[str, str]]
    :param web_acl_id: ARN of the WAFv2 WebACL to attach (despite the field
        name, CloudFront expects the WebACL ARN, not its id)
    :type web_acl_id: Optional[str]
    :param opts: Resource options
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        name: str,
        dist_type: DistributionType,
        description: str,
        aliases: List[str],
        origins: List[OriginConfig],
        cache_policy_id: str,
        acm_certificate: aws.acm.Certificate,
        origin_request_policy_id: Optional[str] = None,
        default_cache_behavior: Optional[List[Dict[str, Any]]] = None,
        ordered_cache_behaviors: Optional[List[Dict[str, Any]]] = None,
        tags: Optional[Dict[str, str]] = None,
        web_acl_id: Optional[str] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ):

        super().__init__("cpr:cloudfront:CloudFrontDistribution", name, None, opts)

        # Validate inputs
        if len(origins) < 1 or len(aliases) < 1:
            raise ValueError("At least one origin and one alias must be provided")

        self.default_cache_behavior = default_cache_behavior

        # Set default tags first, then extend/override with user tags if provided
        default_tags = {
            "CPR-Created-By": "pulumi",
            "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
            "CPR-Pulumi-Project-Name": pulumi.get_project(),
            "CPR-Tag": tag_name(),
        }

        # If user provided tags, update defaults with them (user tags take precedence)
        self.tags = default_tags | (tags or {})

        # Create the distribution
        self.distribution = self._create_distribution(
            dist_type,
            description,
            aliases,
            origins,
            cache_policy_id,
            acm_certificate,
            origin_request_policy_id,
            ordered_cache_behaviors,
            web_acl_id,
        )

        # Register outputs
        self.register_outputs(
            {
                "distribution_id": self.distribution.id,
                "domain_name": self.distribution.domain_name,
            }
        )

    def _create_origins(self, origins: List[OriginConfig]) -> List[Dict[str, Any]]:
        """Create the origins configuration for CloudFront."""
        return [
            {
                "domain_name": origin.domain_name,
                "origin_id": origin.origin_id,
                "origin_path": origin.origin_path,
                "custom_headers": [
                    {"header_name": name, "header_value": value}
                    for name, value in (origin.custom_headers or {}).items()
                ],
                "custom_origin_config": {
                    "http_port": 80,
                    "https_port": 443,
                    "origin_protocol_policy": "https-only",
                    "origin_ssl_protocols": ["TLSv1.2"],
                    "origin_read_timeout": origin.read_timeout,
                    "origin_keepalive_timeout": origin.keepalive_timeout,
                },
                "connection_attempts": 3,
                "connection_timeout": origin.connection_timeout,
            }
            for origin in origins
        ]

    def _create_default_cache_behaviour(
        self,
        target_origin_id: str,
        cache_policy_id: str,
        origin_request_policy_id: Optional[str],
    ) -> Dict[str, Any]:
        """Create the default cache behaviour configuration."""
        behaviour = {
            "target_origin_id": target_origin_id,
            "viewer_protocol_policy": "redirect-to-https",
            "allowed_methods": ["HEAD", "GET"],
            "cached_methods": ["HEAD", "GET"],
            "compress": True,
            "cache_policy_id": cache_policy_id,
        }

        if origin_request_policy_id:
            behaviour["origin_request_policy_id"] = origin_request_policy_id

        return behaviour

    def _build_distribution_config(
        self,
        dist_type: DistributionType,
        aliases: List[str],
        origins: List[OriginConfig],
        cache_policy_id: str,
        acm_certificate_arn: str,
        origin_request_policy_id: Optional[str],
        ordered_cache_behaviors: Optional[List[Dict[str, Any]]] = None,
        web_acl_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        config = {
            "aliases": aliases,
            "enabled": True,
            "http_version": "http2",
            "is_ipv6_enabled": True,
            "price_class": "PriceClass_All",
            "origins": self._create_origins(origins),
            "default_cache_behavior": (
                self.default_cache_behavior
                if self.default_cache_behavior is not None
                else self._create_default_cache_behaviour(
                    origins[0].origin_id, cache_policy_id, origin_request_policy_id
                )
            ),
            "viewer_certificate": {
                "acm_certificate_arn": acm_certificate_arn,
                "ssl_support_method": "sni-only",
                "minimum_protocol_version": "TLSv1.2_2021",
            },
            "restrictions": {
                "geo_restriction": {
                    "restriction_type": "none",
                    "locations": [],
                }
            },
        }

        if ordered_cache_behaviors:
            config["ordered_cache_behaviors"] = ordered_cache_behaviors

        if web_acl_id:
            config["web_acl_id"] = web_acl_id

        return config

    def _create_distribution(
        self,
        dist_type: DistributionType,
        description: str,
        aliases: List[str],
        origins: List[OriginConfig],
        cache_policy_id: str,
        acm_certificate: aws.acm.Certificate,
        origin_request_policy_id: Optional[str],
        ordered_cache_behaviors: Optional[List[Dict[str, Any]]] = None,
        web_acl_id: Optional[str] = None,
        opts: Optional[pulumi.ResourceOptions] = None,
    ) -> aws.cloudfront.Distribution:
        # Allow user options to override our defaults.
        resource_opts = pulumi.ResourceOptions.merge(
            pulumi.ResourceOptions(
                parent=self, depends_on=[acm_certificate], protect=True
            ),
            opts or pulumi.ResourceOptions(),
        )
        return aws.cloudfront.Distribution(
            self._name,
            comment=description,
            **self._build_distribution_config(
                dist_type,
                aliases,
                origins,
                cache_policy_id,
                cast(str, acm_certificate.arn),
                origin_request_policy_id,
                ordered_cache_behaviors,
                web_acl_id,
            ),
            opts=resource_opts,
            tags=self.tags,
        )
