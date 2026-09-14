"""
Grafana Cloud Frontend Observability (Faro) apps, one per theme.

Only one app exists in Grafana Cloud today (cpr-frontend), even though the
frontend code has sent distinct app.name values per theme (cclw-frontend,
mcf-frontend, ccc-frontend) for a while -- all three non-CPR themes'
telemetry has been landing inside cpr-frontend's data, tagged but not
actually separated.

One app per theme, not per env: what's live in Grafana today is one app per
theme shared across staging/production, distinguished by the `environment`
tag Faro sends at runtime (FrontendObservability.tsx), not by separate apps.
This project has a single stack (no staging/production split) since there's
nothing env-specific about a Faro app itself.
"""

from dataclasses import dataclass, field

import pulumi
import pulumiverse_grafana as grafana

GRAFANA_CLOUD_STACK_SLUG = "climatepolicyradar"


@dataclass
class FaroAppConfig:
    allowed_origins: list[str]
    extra_log_attributes: dict[str, str] = field(default_factory=dict)
    settings: dict[str, str] = field(default_factory=dict)


class FaroApp(pulumi.ComponentResource):
    """A Grafana Cloud Frontend Observability app for one theme."""

    def __init__(
        self,
        name: str,
        config: FaroAppConfig,
        provider: grafana.Provider,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("cpr:grafana:FaroApp", name, None, opts)

        stack = grafana.cloud.get_stack(
            slug=GRAFANA_CLOUD_STACK_SLUG,
            opts=pulumi.InvokeOptions(provider=provider, parent=self),
        )

        self.app = grafana.frontendobservability.App(
            name,
            name=name,
            stack_id=stack.id,
            allowed_origins=config.allowed_origins,
            extra_log_attributes=config.extra_log_attributes,
            settings=config.settings,
            opts=pulumi.ResourceOptions.merge(
                pulumi.ResourceOptions(parent=self, provider=provider, protect=True),
                opts or pulumi.ResourceOptions(),
            ),
        )

        self.register_outputs(
            {
                "collector_endpoint": self.app.collector_endpoint,
            }
        )
