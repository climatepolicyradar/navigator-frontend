import { trace } from "@opentelemetry/api";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const current = trace.getActiveSpan();

  // set server-timing header with traceparent
  if (current) {
    response.headers.set("server-timing", `traceparent;desc="00-${current.spanContext().traceId}-${current.spanContext().spanId}-01"`);
  }

  // Surface WAF's bot signal as a client-readable cookie for posthog-js.
  const isWafBot = request.headers.get("x-amzn-waf-is-bot") === "true";
  response.cookies.set("is_waf_bot", String(isWafBot), { httpOnly: false, path: "/", sameSite: "lax" });

  return response;
}
