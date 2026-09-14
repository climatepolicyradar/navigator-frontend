"""Grafana Cloud Frontend Observability (Faro) apps for the frontend estate."""

from dataclasses import dataclass

import pulumi
import pulumiverse_grafana as grafana
from faro_app import FaroApp, FaroAppConfig


@dataclass(frozen=True)
class Theme:
    """This theme's custom production domain(s) (apex and wildcard), for the
    Faro app's allowed_origins. Themes with no custom domain get none."""

    custom_origins: tuple[str, ...] = ()


THEMES: dict[str, Theme] = {
    "cpr": Theme(
        custom_origins=(
            "https://climatepolicyradar.org",
            "https://*.climatepolicyradar.org",
        ),
    ),
    "cclw": Theme(
        custom_origins=("https://climate-laws.org", "https://*.climate-laws.org"),
    ),
    "mcf": Theme(
        custom_origins=(
            "https://climateprojectexplorer.org",
            "https://*.climateprojectexplorer.org",
        ),
    ),
    "ccc": Theme(
        custom_origins=(
            "https://climatecasechart.com",
            "https://*.climatecasechart.com",
            "https://www.climatecasechart.com",
        ),
    ),
}

config = pulumi.Config()

# Frontend Observability apps are a different Grafana Cloud API (GCom access
# policies) from Synthetic Monitoring's (see ../synthetic_monitoring), so
# this project has its own provider and credential rather than sharing one.
grafana_provider = grafana.Provider(
    "grafana-faro",
    cloud_access_policy_token=config.require_secret(
        "grafana_cloud_access_policy_token"
    ),
)

for theme, theme_config in THEMES.items():
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
        provider=grafana_provider,
    )
    pulumi.export(f"{theme}_faro_collector_endpoint", faro_app.app.collector_endpoint)
