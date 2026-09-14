"""Component resource for a Grafana Cloud Frontend Observability (Faro) app.

One app per theme, shared across that theme's staging/production/review
stacks (all tagged with the same app.name today; see FrontendObservability.tsx)
-- so this should only be invoked once per theme, from whichever stack owns
that decision, with other stacks reading its collector_endpoint output via a
StackReference rather than each creating their own app.
"""

from dataclasses import dataclass

import pulumi
import pulumiverse_grafana as grafana

GRAFANA_CLOUD_STACK_SLUG = "climatepolicyradar"


@dataclass
class FaroAppConfig:
    allowed_origins: list[str]


class FaroApp(pulumi.ComponentResource):
    """A component resource for creating a Grafana Cloud Frontend Observability app.

    :param name: The Faro app name (e.g. "cclw-frontend"). Matches the
        app.name the frontend reports at runtime.
    :type name: str
    :param config: App configuration.
    :type config: FaroAppConfig
    :param opts: Resource options.
    :type opts: Optional[pulumi.ResourceOptions]
    """

    def __init__(
        self,
        name: str,
        config: FaroAppConfig,
        opts: pulumi.ResourceOptions | None = None,
    ):
        super().__init__("pkg:index:FaroApp", name, None, opts)

        stack = grafana.cloud.get_stack(slug=GRAFANA_CLOUD_STACK_SLUG)

        self.app = grafana.frontendobservability.App(
            name,
            name=name,
            stack_id=stack.id,
            allowed_origins=config.allowed_origins,
            extra_log_attributes={},
            settings={},
            opts=pulumi.ResourceOptions.merge(
                pulumi.ResourceOptions(parent=self, protect=True),
                opts or pulumi.ResourceOptions(),
            ),
        )

        self.register_outputs(
            {
                "collector_endpoint": self.app.collector_endpoint,
            }
        )
