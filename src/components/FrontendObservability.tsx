"use client";

import { faro, getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

export const FrontendObservability = (): null => {
  console.log("FrontendObservability");
  // skip if already initialized
  if (faro.api) {
    return null;
  }

  try {
    const faro = initializeFaro({
      url: "https://faro-collector-prod-gb-south-0.grafana.net/collect/74f6d4bd78b7bb2cc270036193aaa3a6",
      app: {
        name: "cpr-frontend",
        namespace: "frontend",
        version: "1",
        environment: "local",
      },

      instrumentations: [
        // Mandatory, omits default instrumentations otherwise.
        ...getWebInstrumentations(),

        // Tracing package to get end-to-end visibility for HTTP requests.
        new TracingInstrumentation(),
      ],
    });
  } catch (e) {
    return null;
  }
  return null;
};
