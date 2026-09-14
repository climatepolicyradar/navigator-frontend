"""
Grafana Synthetic Monitoring checks for one frontend theme.

We test our systems at two tiers

- cdn: CloudFront - this ensures our edge is functioning as expected
- origin: ECS Express Gateway endpoint - this avoids false security from cached results

Running both is what makes an alert actionable: cdn red with origin green is a
CloudFront, WAF, DNS or certificate fault, while both red is the container or
the backend it calls.
"""

from collections.abc import Sequence
from dataclasses import dataclass, field
from pathlib import Path

from typing import Literal, get_args
import pulumi
import pulumiverse_grafana as grafana

# Next.js pages router emits this on every server-rendered page. Asserting on
# it distinguishes "the app rendered" from "CloudFront/WAF returned a 200-shaped
# error page", which a bare status-code check cannot.
SSR_MARKER = "__NEXT_DATA__"

# How many of a check's probes must fail for 5 minutes before it alerts: high
# 5%, medium 10%, low 25%, none never. Note these are proportions, so with a
# handful of probes any single failure trips medium. More probes improve
# uptime accuracy, they don't damp alerts.
# @see: https://grafana.com/docs/grafana-cloud/testing/synthetic-monitoring/configure-alerts/synthetic-monitoring-alerting/
AlertSensitivity = Literal["none", "low", "medium", "high"]
ALERT_SENSITIVITIES: tuple[AlertSensitivity, ...] = get_args(AlertSensitivity)


JOURNEY_SCRIPT_FILE = "journey_check.js"


def render_journey_script(base: str, sitemap: str, ssr_marker: str) -> str:
    """
    Load the journey k6 script and fill in its placeholders.

    We use a .js to enable linting and validation. This method will fail if the script
    drifts from the method arguments.
    """
    script = (Path(__file__).parent / JOURNEY_SCRIPT_FILE).read_text()

    for placeholder, value in (
        ("__BASE__", base),
        ("__SITEMAP__", sitemap),
        ("__SSR_MARKER__", ssr_marker),
    ):
        # Renaming a token in the .js file should fail the preview, not upload
        # a half-substituted script.
        if placeholder not in script:
            raise ValueError(f"{JOURNEY_SCRIPT_FILE} has no {placeholder} placeholder")
        script = script.replace(placeholder, value)

    return script


@dataclass
class SyntheticsConfig:
    """Configuration for a stack's synthetic checks."""

    # CloudFront URL provided by upstream frontend/{env}-{theme} stack
    app_url: pulumi.Input[str]
    # ECS service URL provided by upstream frontend/{env}-{theme} stack
    origin_url: pulumi.Input[str]
    theme: str
    env: str
    alert_sensitivity: AlertSensitivity
    # If available - we will traverse this for values like `geography/{geo}` and test
    # against those
    sitemap_path: str | None = None
    probe_names: Sequence[str] = field(default_factory=lambda: ["London"])
    frequency_ms: int = 60_000
    timeout_ms: int = 10_000


def _resolve_probe_ids(available: dict[str, int], wanted: Sequence[str]) -> list[int]:
    """Map probe names to Grafana IDs, failing loudly on an unknown name. Fail loudly on a miss."""
    missing = [name for name in wanted if name not in available]
    if missing:
        raise ValueError(
            f"Unknown Grafana probe(s): {', '.join(missing)}. "
            f"Available: {', '.join(sorted(available))}"
        )
    return [available[name] for name in wanted]


class FrontendSynthetics(pulumi.ComponentResource):
    """CDN and origin synthetic checks for one frontend stack."""

    def __init__(
        self,
        name: str,
        config: SyntheticsConfig,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("cpr:grafana:FrontendSynthetics", name, None, opts)

        child_opts = pulumi.ResourceOptions(parent=self)
        labels = {
            "theme": config.theme,
            "environment": config.env,
        }
        prefix = f"{config.theme}-{config.env}"

        probe_ids = grafana.syntheticmonitoring.get_probes_output(
            opts=pulumi.InvokeOptions(parent=self)
        ).probes.apply(lambda probes: _resolve_probe_ids(probes, config.probe_names))

        # Both arrive as StackReference outputs. cclw and mcf set app_url with
        # a trailing slash and the others don't, so normalise before appending
        # paths -- otherwise targets come out as ".../{}//search".
        cdn_base = pulumi.Output.from_input(config.app_url).apply(
            lambda url: url.rstrip("/")
        )
        origin_base = pulumi.Output.from_input(config.origin_url).apply(
            lambda url: url.rstrip("/")
        )

        # CDN: Test against CloudFront
        self.cdn_home = self._http_check(
            f"{prefix}-cdn-home",
            job=f"{prefix}-cdn-home",
            target=cdn_base.apply(lambda base: f"{base}/"),
            config=config,
            probe_ids=probe_ids,
            labels={**labels, "tier": "cdn"},
            body_regexps=[SSR_MARKER],
            opts=child_opts,
        )

        self.cdn_search = self._http_check(
            f"{prefix}-cdn-search",
            job=f"{prefix}-cdn-search",
            target=cdn_base.apply(lambda base: f"{base}/search?q=climate"),
            config=config,
            probe_ids=probe_ids,
            labels={**labels, "tier": "cdn"},
            body_regexps=[SSR_MARKER],
            opts=child_opts,
        )

        self.cdn_health = self._http_check(
            f"{prefix}-cdn-health",
            job=f"{prefix}-cdn-health",
            target=cdn_base.apply(lambda base: f"{base}/api/health"),
            config=config,
            probe_ids=probe_ids,
            labels={**labels, "tier": "cdn"},
            body_regexps=['"version"'],
            opts=child_opts,
        )

        # Origin: Test against ECS containers directly
        origin_paths = ["/", "/search?q=climate", "/robots.txt", "/api/health"]
        sitemap_path = config.sitemap_path
        if sitemap_path:
            origin_paths.append(sitemap_path)

        self.origin_routes = grafana.syntheticmonitoring.Check(
            f"{prefix}-origin-routes",
            job=f"{prefix}-origin-routes",
            target=origin_base.apply(lambda base: f"{base}/"),
            probes=probe_ids,
            enabled=True,
            frequency=config.frequency_ms,
            timeout=config.timeout_ms,
            alert_sensitivity=config.alert_sensitivity,
            labels={**labels, "tier": "origin"},
            settings=grafana.syntheticmonitoring.CheckSettingsArgs(
                multihttp=grafana.syntheticmonitoring.CheckSettingsMultihttpArgs(
                    entries=[
                        self._multihttp_entry(origin_base, path)
                        for path in origin_paths
                    ],
                ),
            ),
            opts=child_opts,
        )

        # Journey: If a sitemap exists, traverse it for URLs to tests
        self.journey = None
        if sitemap_path:
            script = cdn_base.apply(
                lambda base: render_journey_script(
                    base=base,
                    sitemap=f"{base}{sitemap_path}",
                    ssr_marker=SSR_MARKER,
                )
            )
            self.journey = grafana.syntheticmonitoring.Check(
                f"{prefix}-cdn-journey",
                job=f"{prefix}-cdn-journey",
                target=cdn_base.apply(lambda base: f"{base}/"),
                probes=probe_ids,
                enabled=True,
                # Scripted checks are billed per execution and do real work, so
                # they run less often than the cheap HTTP checks. Note a
                # Grafana "time point" is one frequency interval, so this
                # check's uptime is measured in 5-minute blocks against the
                # HTTP checks' 1-minute ones in production -- the same uptime
                # percentage does not mean the same thing across the two.
                frequency=300_000,
                timeout=30_000,
                alert_sensitivity=config.alert_sensitivity,
                labels={**labels, "tier": "journey"},
                settings=grafana.syntheticmonitoring.CheckSettingsArgs(
                    scripted=grafana.syntheticmonitoring.CheckSettingsScriptedArgs(
                        script=script,
                    ),
                ),
                opts=child_opts,
            )

        self.register_outputs({})

    def _http_check(
        self,
        name: str,
        job: str,
        target: pulumi.Input[str],
        config: SyntheticsConfig,
        probe_ids: pulumi.Input[list[int]],
        labels: dict[str, str],
        body_regexps: list[str],
        opts: pulumi.ResourceOptions,
    ) -> grafana.syntheticmonitoring.Check:
        return grafana.syntheticmonitoring.Check(
            name,
            job=job,
            target=target,
            probes=probe_ids,
            enabled=True,
            frequency=config.frequency_ms,
            timeout=config.timeout_ms,
            alert_sensitivity=config.alert_sensitivity,
            labels=labels,
            settings=grafana.syntheticmonitoring.CheckSettingsArgs(
                http=grafana.syntheticmonitoring.CheckSettingsHttpArgs(
                    method="GET",
                    valid_status_codes=[200],
                    fail_if_not_ssl=True,
                    fail_if_body_not_matches_regexps=body_regexps,
                    # We bust the CDN cache for a quicker time-to knowing there is an issue.
                    cache_busting_query_param_name="__sm_cb",
                ),
            ),
            opts=opts,
        )

    def _multihttp_entry(
        self, base: pulumi.Output[str], path: str
    ) -> grafana.syntheticmonitoring.CheckSettingsMultihttpEntryArgs:
        marker = '"version"' if path == "/api/health" else SSR_MARKER
        assertions = [
            grafana.syntheticmonitoring.CheckSettingsMultihttpEntryAssertionArgs(
                type="TEXT",
                subject="HTTP_STATUS_CODE",
                condition="EQUALS",
                value="200",
            )
        ]
        # robots.txt and the sitemap are not Next pages, so neither marker
        # applies -- a 200 is the whole assertion.
        if path not in ("/robots.txt",) and not path.endswith("sitemap.xml"):
            assertions.append(
                grafana.syntheticmonitoring.CheckSettingsMultihttpEntryAssertionArgs(
                    type="TEXT",
                    subject="RESPONSE_BODY",
                    condition="CONTAINS",
                    value=marker,
                )
            )

        return grafana.syntheticmonitoring.CheckSettingsMultihttpEntryArgs(
            request=grafana.syntheticmonitoring.CheckSettingsMultihttpEntryRequestArgs(
                method="GET",
                url=base.apply(lambda b: f"{b}{path}"),
            ),
            assertions=assertions,
        )
