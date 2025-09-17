import { registerOTel } from "@vercel/otel";

export function register() {
  /** @see: https://nextjs.org/docs/app/guides/open-telemetry */
  registerOTel({ serviceName: "navigator-frontend" });
}
