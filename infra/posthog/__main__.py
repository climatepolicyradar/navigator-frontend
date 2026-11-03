"""CloudFront reverse proxy for PostHog.

posthog-js talks to eu.i.posthog.com directly, which content blockers and some
corporate DNS resolvers drop outright -- those users are simply absent from our
analytics rather than under-counted. Fronting PostHog with a distribution on
our own domain makes the requests first-party, so they survive.

PostHog splits its traffic across two hostnames and so this needs two origins:

  - eu.i.posthog.com          event capture, feature flag evaluation, session
                              recording chunks. Everything not matched below.
  - eu-assets.i.posthog.com   the posthog-js bundles (/static/*) and the remote
                              config the SDK polls for flag definitions
                              (/array/*).

@see: https://posthog.com/docs/advanced/proxy/cloudfront
"""

import pulumi
import pulumi_aws as aws

# Ours is a EU-region PostHog project -- see src/context/PostHogInit.tsx, which
# initialises posthog-js against eu.i.posthog.com. The US endpoints
# (us.i.posthog.com / us-assets.i.posthog.com) know nothing about our project
# token and would 401 every event.
EVENTS_ORIGIN_DOMAIN = "eu.i.posthog.com"
ASSETS_ORIGIN_DOMAIN = "eu-assets.i.posthog.com"

EVENTS_ORIGIN_ID = "posthog-events"
ASSETS_ORIGIN_ID = "posthog-assets"

# /static/* is the posthog-js bundle and the chunks it lazily pulls in (the
# session recorder, the surveys widget). /array/* is the remote config holding
# feature flag definitions. Both are served by the assets origin, which sets the
# Cache-Control that makes them cheap to serve; routing them at the events
# origin instead loses those headers and re-fetches config on every page load.
ASSET_PATH_PATTERNS = ["/static/*", "/array/*"]

config = pulumi.Config()
env = pulumi.get_stack()

# Deliberately not a derived name. PostHog's own guidance is to avoid anything a
# blocklist maintainer would recognise -- /analytics, /tracking, /posthog -- and
# the whole point of the proxy is defeated if the hostname gives it away.
proxy_domain = config.require("proxy_domain")

aws_env_stack = pulumi.StackReference(f"climatepolicyradar/aws_env/{env}")
# require_output rather than get_output: a missing zone should fail here, not
# silently produce records in a zone called "None".
hosted_zone_id = aws_env_stack.require_output("root_zone_id")

TAGS = {
    "CPR-Created-By": "pulumi",
    "CPR-Pulumi-Stack-Name": pulumi.get_stack(),
    "CPR-Pulumi-Project-Name": pulumi.get_project(),
    "Environment": env,
}

########################################################################
# Certificate
########################################################################

# CloudFront reads certificates from us-east-1 only, whichever region the rest
# of the stack lives in.
us_east_1 = aws.Provider("us-east-1", region="us-east-1")

certificate = aws.acm.Certificate(
    "posthog-proxy-cert",
    domain_name=proxy_domain,
    validation_method="DNS",
    tags=TAGS,
    opts=pulumi.ResourceOptions(provider=us_east_1),
)


def _create_validation_records(options) -> list[aws.route53.Record]:
    """Publish the CNAMEs ACM checks for.

    The validation options only exist once the certificate does, hence the
    apply below rather than a plain list comprehension at the top level.
    """
    return [
        aws.route53.Record(
            f"posthog-proxy-cert-validation-{index}",
            zone_id=hosted_zone_id,
            name=option.resource_record_name,
            type=option.resource_record_type,
            records=[option.resource_record_value],
            ttl=60,
        )
        for index, option in enumerate(options)
    ]


validation_records = certificate.domain_validation_options.apply(
    _create_validation_records
)

certificate_validation = aws.acm.CertificateValidation(
    "posthog-proxy-cert-validation",
    certificate_arn=certificate.arn,
    validation_record_fqdns=validation_records.apply(
        lambda records: [record.fqdn for record in records]
    ),
    opts=pulumi.ResourceOptions(provider=us_east_1),
)

########################################################################
# CloudFront policies
########################################################################

# One cache policy for every behaviour on this distribution.
#
# The TTLs are deliberately 0/0. PostHog sets its own Cache-Control on
# everything it serves -- no-store on the event and flag endpoints, a long
# max-age on the asset bundles -- so CloudFront should honour the origin rather
# than impose a default of its own. CloudFront's console default (default_ttl of
# 24h) would cache flag evaluations and /array/* remote config, which is exactly
# how a proxy ends up serving a stale feature flag for a day after someone
# toggles it. max_ttl stays high so PostHog's long max-age on bundles is
# respected rather than capped.
cache_policy = aws.cloudfront.CachePolicy(
    "posthog-cache-policy",
    name=f"posthog-proxy-{env}",
    comment="PostHog reverse proxy - caches only what PostHog asks us to",
    min_ttl=0,
    default_ttl=0,
    max_ttl=31536000,  # 1 year, only reached when the origin asks for it
    parameters_in_cache_key_and_forwarded_to_origin=aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginArgs(
        enable_accept_encoding_gzip=True,
        enable_accept_encoding_brotli=True,
        headers_config=aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginHeadersConfigArgs(
            header_behavior="whitelist",
            headers=aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginHeadersConfigHeadersArgs(
                # Origin keeps per-site CORS responses from being shared between
                # themes; Authorization keeps authenticated reads out of a
                # shared cache entry.
                items=["Origin", "Authorization"],
            ),
        ),
        # Host is deliberately absent: CloudFront then sends the origin's own
        # hostname upstream, which is what PostHog routes on. Forwarding the
        # viewer's Host would have it looking up a project on t.climate... .
        cookies_config=aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginCookiesConfigArgs(
            cookie_behavior="none",
        ),
        query_strings_config=aws.cloudfront.CachePolicyParametersInCacheKeyAndForwardedToOriginQueryStringsConfigArgs(
            query_string_behavior="all",
        ),
    ),
)

# The asset behaviours need the viewer's Origin header forwarded so PostHog can
# echo it back in Access-Control-Allow-Origin, but nothing else. The managed
# CORS-CustomOrigin policy used on the default behaviour forwards the full
# preflight set, which is more than a static bundle needs in its cache key.
assets_origin_request_policy = aws.cloudfront.OriginRequestPolicy(
    "posthog-assets-origin-request-policy",
    name=f"posthog-proxy-assets-{env}",
    comment="PostHog reverse proxy - static assets and remote config",
    headers_config=aws.cloudfront.OriginRequestPolicyHeadersConfigArgs(
        header_behavior="whitelist",
        headers=aws.cloudfront.OriginRequestPolicyHeadersConfigHeadersArgs(
            items=["Origin"],
        ),
    ),
    cookies_config=aws.cloudfront.OriginRequestPolicyCookiesConfigArgs(
        cookie_behavior="none",
    ),
    query_strings_config=aws.cloudfront.OriginRequestPolicyQueryStringsConfigArgs(
        query_string_behavior="all",
    ),
)

# AWS-managed policies, looked up by name rather than pasted in as their
# well-known UUIDs so that a wrong one fails the preview instead of quietly
# producing a distribution that strips CORS headers.
cors_origin_request_policy = aws.cloudfront.get_origin_request_policy(
    name="Managed-CORS-CustomOrigin"
)
cors_response_headers_policy = aws.cloudfront.get_response_headers_policy(
    name="Managed-CORS-with-preflight-and-SecurityHeadersPolicy"
)

########################################################################
# Distribution
########################################################################


def _origin(origin_id: str, domain_name: str) -> aws.cloudfront.DistributionOriginArgs:
    """Build one HTTPS-only origin. Both PostHog hostnames are configured alike."""
    return aws.cloudfront.DistributionOriginArgs(
        origin_id=origin_id,
        domain_name=domain_name,
        custom_origin_config=aws.cloudfront.DistributionOriginCustomOriginConfigArgs(
            http_port=80,
            https_port=443,
            origin_protocol_policy="https-only",
            origin_ssl_protocols=["TLSv1.2"],
        ),
    )


# No WAF here, unlike the frontend distributions. Session recording payloads run
# to megabytes and WAF only inspects request bodies up to its own size limit, so
# the rules would either reject legitimate recordings or cost a good deal to
# raise the limit for. The origin is PostHog's API rather than ours, so there is
# little for a WAF to protect.
distribution = aws.cloudfront.Distribution(
    "posthog-proxy",
    comment=f"PostHog reverse proxy ({proxy_domain})",
    enabled=True,
    is_ipv6_enabled=True,
    http_version="http2",
    price_class="PriceClass_All",
    aliases=[proxy_domain],
    origins=[
        _origin(EVENTS_ORIGIN_ID, EVENTS_ORIGIN_DOMAIN),
        _origin(ASSETS_ORIGIN_ID, ASSETS_ORIGIN_DOMAIN),
    ],
    default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
        target_origin_id=EVENTS_ORIGIN_ID,
        viewer_protocol_policy="redirect-to-https",
        # Event capture, flag evaluation and session recording chunks are all
        # POSTs. The GET/HEAD pair the frontend distributions use would 405 the
        # lot of them.
        allowed_methods=["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
        cached_methods=["GET", "HEAD", "OPTIONS"],
        compress=True,
        cache_policy_id=cache_policy.id,
        origin_request_policy_id=cors_origin_request_policy.id,
    ),
    ordered_cache_behaviors=[
        aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
            path_pattern=path_pattern,
            target_origin_id=ASSETS_ORIGIN_ID,
            viewer_protocol_policy="redirect-to-https",
            allowed_methods=["GET", "HEAD", "OPTIONS"],
            cached_methods=["GET", "HEAD", "OPTIONS"],
            compress=True,
            cache_policy_id=cache_policy.id,
            origin_request_policy_id=assets_origin_request_policy.id,
            response_headers_policy_id=cors_response_headers_policy.id,
        )
        for path_pattern in ASSET_PATH_PATTERNS
    ],
    viewer_certificate=aws.cloudfront.DistributionViewerCertificateArgs(
        # The validation's arn rather than the certificate's, so the
        # distribution waits for ACM to actually issue before it goes live.
        acm_certificate_arn=certificate_validation.certificate_arn,
        ssl_support_method="sni-only",
        minimum_protocol_version="TLSv1.2_2021",
    ),
    restrictions=aws.cloudfront.DistributionRestrictionsArgs(
        geo_restriction=aws.cloudfront.DistributionRestrictionsGeoRestrictionArgs(
            restriction_type="none",
        ),
    ),
    tags=TAGS,
)

########################################################################
# DNS
########################################################################

# Both record types, since the distribution serves IPv6.
for record_type in ("A", "AAAA"):
    aws.route53.Record(
        f"posthog-proxy-{record_type.lower()}",
        zone_id=hosted_zone_id,
        name=proxy_domain,
        type=record_type,
        aliases=[
            aws.route53.RecordAliasArgs(
                name=distribution.domain_name,
                # CloudFront's own fixed zone, read off the distribution rather
                # than pasted in as the well-known Z2FDTNDATAQYW2.
                zone_id=distribution.hosted_zone_id,
                evaluate_target_health=False,
            )
        ],
    )

########################################################################
# Exports
########################################################################

pulumi.export("proxy_domain", proxy_domain)
# What posthog-js should be given as its api_host.
pulumi.export("proxy_url", f"https://{proxy_domain}")
pulumi.export("distribution_id", distribution.id)
pulumi.export("distribution_domain_name", distribution.domain_name)
