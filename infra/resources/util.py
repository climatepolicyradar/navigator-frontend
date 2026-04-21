import os
import subprocess  # nosec: B404
from dataclasses import dataclass
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple, TypedDict
from urllib.parse import urlparse

import pulumi
import pulumi_aws as aws


def parse_hostname(hostname_url: str) -> Tuple[str, str]:
    """Parse a hostname URL into domain and subdomain.

    :param hostname_url: Full hostname URL (e.g. https://ccc.staging.climatepolicyradar.org/)
    :type hostname_url: str
    :return: Tuple of (domain_name, subdomain)
    :rtype: Tuple[str, str]
    """
    # Remove protocol and trailing slashes
    parsed = urlparse(hostname_url)
    full_domain = parsed.netloc or parsed.path.strip("/")

    # Split into parts
    parts = full_domain.split(".")

    if len(parts) <= 2:
        # Simple domain like example.com
        return (".".join(parts), "")
    elif parts[-2] == "climatepolicyradar":
        # Subdomain of climatepolicyradar.org
        return ("climatepolicyradar.org", ".".join(parts[:-2]))
    else:
        # Custom domain like climate-laws.org
        return (".".join(parts[-2:]), ".".join(parts[:-2]))


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

    expected_account_id = config.require_secret("validation_account_id")
    deploy_identity = aws.get_caller_identity()

    expected_account_id.apply(
        lambda expected: (_ for _ in ()).throw(
            RuntimeError(
                "The AWS credentials in use do not match the expected account ID."
            )
        )
        if expected != deploy_identity.account_id
        else None
    )


def get_active_branch() -> str:
    """Get the active branch of the repository."""
    return (
        subprocess.run(  # nosec: B603, B607
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
        subprocess.run(  # nosec: B603, B607
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
    

class BehaviourTypes(Enum):
    """Enum for behaviour types."""

    HEADER = "Header"
    QUERY_STRING = "QueryString"
    COOKIE = "Cookie"


class BehaviourOptions(Enum):
    """Enum for behaviour options."""

    NONE = "none"
    WHITELIST = "whitelist"
    ALL = "all"


@dataclass
class HeaderConfig:
    """Configuration for headers in policies."""

    behaviour: BehaviourOptions
    items: Optional[List[str]] = None


@dataclass
class CookieConfig:
    """Configuration for cookies in policies."""

    behaviour: BehaviourOptions
    items: Optional[List[str]] = None


@dataclass
class QueryStringConfig:
    """Configuration for query strings in policies."""

    behaviour: BehaviourOptions
    items: Optional[List[str]] = None


class CachePolicyItemsConfig(TypedDict):
    """Type definition for Cache Policy items configuration."""

    quantity: int
    items: List[str]


class CachePolicyConfig(TypedDict):
    """Type definition for Cache Policy configuration section."""

    headers_config: Dict[str, Any]
    cookies_config: Dict[str, Any]
    query_strings_config: Dict[str, Any]
    enable_accept_encoding_gzip: bool
    enable_accept_encoding_brotli: bool


class OriginRequestPolicyConfig(TypedDict, total=False):
    """Type definition for Origin Request Policy configuration section."""

    headers_config: Dict[str, Any]
    cookies_config: Dict[str, Any]
    query_strings_config: Dict[str, Any]


def build_items_config(items: Optional[List[str]] = None) -> CachePolicyItemsConfig:
    """
    Build a configuration section for items in a Cache Policy.

    :param items: Optional list of items
    :type items: Optional[List[str]]
    :return: Items configuration with quantity
    :rtype: CachePolicyItemsConfig
    """
    actual_items = items if items else []
    return {"quantity": len(actual_items), "items": actual_items}


def build_cache_policy_config(
    headers: HeaderConfig,
    cookies: CookieConfig,
    query_strings: QueryStringConfig,
) -> CachePolicyConfig:
    """
    Build a configuration for a CloudFront Cache Policy.

    :param headers: Headers configuration
    :type headers: HeaderConfig
    :param cookies: Cookies configuration
    :type cookies: CookieConfig
    :param query_strings: Query strings configuration
    :type query_strings: QueryStringConfig
    :return: Complete cache policy configuration
    :rtype: CachePolicyConfig
    """
    config: CachePolicyConfig = {
        "headers_config": {
            "header_behavior": headers.behaviour.value,
        },
        "cookies_config": {
            "cookie_behavior": cookies.behaviour.value,
        },
        "query_strings_config": {
            "query_string_behavior": query_strings.behaviour.value,
        },
        "enable_accept_encoding_gzip": True,
        "enable_accept_encoding_brotli": True,
    }

    if headers.behaviour == BehaviourOptions.WHITELIST and headers.items:
        config["headers_config"]["headers"] = {
            "items": headers.items,
            "quantity": len(headers.items),
        }
    if cookies.behaviour == BehaviourOptions.WHITELIST and cookies.items:
        config["cookies_config"]["cookies"] = {
            "items": cookies.items,
            "quantity": len(cookies.items),
        }
    if query_strings.behaviour == BehaviourOptions.WHITELIST and query_strings.items:
        config["query_strings_config"]["query_strings"] = {
            "items": query_strings.items,
            "quantity": len(query_strings.items),
        }

    return config


def build_origin_request_policy_config(
    headers: HeaderConfig,
    cookies: CookieConfig,
    query_strings: QueryStringConfig,
) -> OriginRequestPolicyConfig:
    """
    Build a configuration for a CloudFront Origin Request Policy.

    :param headers: Headers configuration
    :type headers: HeaderConfig
    :param cookies: Cookies configuration
    :type cookies: CookieConfig
    :param query_strings: Query strings configuration
    :type query_strings: QueryStringConfig
    :return: Complete origin request policy configuration
    :rtype: OriginRequestPolicyConfig
    """
    config: OriginRequestPolicyConfig = {
        "headers_config": {
            "header_behavior": headers.behaviour.value,
        },
        "cookies_config": {
            "cookie_behavior": cookies.behaviour.value,
        },
        "query_strings_config": {
            "query_string_behavior": query_strings.behaviour.value,
        },
    }

    if headers.behaviour == BehaviourOptions.WHITELIST and headers.items:
        config["headers_config"]["headers"] = {"items": headers.items}
    if cookies.behaviour == BehaviourOptions.WHITELIST and cookies.items:
        config["cookies_config"]["cookies"] = {"items": cookies.items}
    if query_strings.behaviour == BehaviourOptions.WHITELIST and query_strings.items:
        config["query_strings_config"]["query_strings"] = {"items": query_strings.items}

    return config


def tag_name():
    """Create the default tag name to be used for any resource."""
    target_environment = pulumi.get_stack()
    project = pulumi.get_project()

    return f"{target_environment}-{project}"
