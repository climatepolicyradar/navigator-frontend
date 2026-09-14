"""Grafana observability for the frontend estate."""

from dataclasses import dataclass

import pulumi
import pulumiverse_grafana as grafana
from synthetics import ALERT_SENSITIVITIES, FrontendSynthetics, SyntheticsConfig


@dataclass(frozen=True)
class Theme:
    """What this project needs to know about one frontend theme."""

    # if this is specified, we will setup "journey" synthetics, which tracks the sitemap
    # for paths like /geography/{geo} etc.
    sitemap_path: str | None = None


# Each stack is responsible for monitoring every theme.
# We do not create a stack per theme to avoid inhertting that complexity in
# this stack similar to ../platform
THEMES: dict[str, Theme] = {
    "ccc": Theme(sitemap_path="/ccc/sitemap.xml"),
    "cpr": Theme(sitemap_path="/cpr/sitemap.xml"),
    # cclw and mcf have no sitemap route yet, so they get static coverage only
    # until src/pages/{theme}/sitemap.xml.ts lands for them.
    "cclw": Theme(),
    "mcf": Theme(),
}

config = pulumi.Config()
env = pulumi.get_stack()


grafana_provider = grafana.Provider(
    "grafana",
    sm_access_token=config.require_secret("grafana_sm_access_token"),
    sm_url=config.require("grafana_sm_url"),
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
