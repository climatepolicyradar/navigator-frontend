"""Grafana observability for the frontend estate."""

from dataclasses import dataclass

import pulumi
import pulumiverse_grafana as grafana
from faro_app import FaroApp, FaroAppConfig
from synthetics import ALERT_SENSITIVITIES, FrontendSynthetics, SyntheticsConfig


@dataclass(frozen=True)
class Theme:
    """What this project needs to know about one frontend theme."""

    # if this is specified, we will setup "journey" synthetics, which tracks the sitemap
    # for paths like /geography/{geo} etc.
    sitemap_path: str | None = None
    # This theme's custom production domain(s) (apex and wildcard), for the
    # Faro app's allowed_origins. Themes with no custom domain get none.
    custom_origins: tuple[str, ...] = ()


# Each stack is responsible for monitoring every theme.
# We do not create a stack per theme to avoid inhertting that complexity in
# this stack similar to ../platform
THEMES: dict[str, Theme] = {
    "ccc": Theme(
        sitemap_path="/ccc/sitemap.xml",
        custom_origins=(
            "https://climatecasechart.com",
            "https://*.climatecasechart.com",
            "https://www.climatecasechart.com",
        ),
    ),
    "cpr": Theme(
        sitemap_path="/cpr/sitemap.xml",
        custom_origins=(
            "https://climatepolicyradar.org",
            "https://*.climatepolicyradar.org",
        ),
    ),
    # cclw and mcf have no sitemap route yet, so they get static coverage only
    # until src/pages/{theme}/sitemap.xml.ts lands for them.
    "cclw": Theme(
        custom_origins=("https://climate-laws.org", "https://*.climate-laws.org"),
    ),
    "mcf": Theme(
        custom_origins=(
            "https://climateprojectexplorer.org",
            "https://*.climateprojectexplorer.org",
        ),
    ),
}

config = pulumi.Config()
env = pulumi.get_stack()


grafana_provider = grafana.Provider(
    "grafana",
    sm_access_token=config.require_secret("grafana_sm_access_token"),
    sm_url=config.require("grafana_sm_url"),
)

# Separate provider: Faro apps are a different Grafana Cloud API (GCom access
# policies), not the Synthetic Monitoring one above, and can't share a token.
# Only needed in production (Faro apps are only created there), so staging's
# config doesn't need this secret at all.
faro_provider = (
    grafana.Provider(
        "grafana-faro",
        cloud_access_policy_token=config.require_secret(
            "grafana_cloud_access_policy_token"
        ),
    )
    if env == "production"
    else None
)

# Guarded here so a typo fails the preview instead of the apply.
alert_sensitivity = config.require("alert_sensitivity")
if alert_sensitivity not in ALERT_SENSITIVITIES:
    raise ValueError(
        f"Invalid alert_sensitivity '{alert_sensitivity}'. "
        f"Expected one of: {', '.join(ALERT_SENSITIVITIES)}"
    )

frequency_ms = config.require_int("frequency_ms")

for theme, theme_config in THEMES.items():
    frontend = pulumi.StackReference(f"climatepolicyradar/frontend/{theme}-{env}")
    probe_names = config.require_object("grafana_probe_names")

    FrontendSynthetics(
        f"{theme}-{env}-synthetics",
        config=SyntheticsConfig(
            theme=theme,
            env=env,
            # require_output rather than get_output: a missing export should
            # fail here, not silently produce a check pointed at "None".
            app_url=frontend.require_output("app_url"),
            origin_url=frontend.require_output("ecs_service_url"),
            sitemap_path=theme_config.sitemap_path,
            probe_names=probe_names,
            frequency_ms=frequency_ms,
            alert_sensitivity=alert_sensitivity,
        ),
        opts=pulumi.ResourceOptions(provider=grafana_provider),
    )

    # One Faro app per theme regardless of env -- matches what's live in
    # Grafana today (one app per theme, shared by staging/production,
    # distinguished by the `environment` tag Faro sends at runtime). Created
    # only from this project's production stack; the frontend project reads
    # it back via a StackReference to this stack for every env.
    if env == "production":
        faro_app = FaroApp(
            f"{theme}-frontend",
            config=FaroAppConfig(
                allowed_origins=[
                    f"https://{theme}.staging.climatepolicyradar.org",
                    f"https://{theme}.production.climatepolicyradar.org",
                    # Review stacks run on ECS, not a predictable per-PR domain.
                    "https://*.ecs.eu-west-1.on.aws",
                    "http://localhost",
                    "http://localhost:3000",
                    *theme_config.custom_origins,
                ],
            ),
            provider=faro_provider,
        )
        pulumi.export(
            f"{theme}_faro_collector_endpoint", faro_app.app.collector_endpoint
        )
