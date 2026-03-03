/**
 * Public app origin for JSON-LD canonical URLs (e.g. https://cpr.staging.climatepolicyradar.org).
 * Uses APP_URL only — do not use HOSTNAME here; Next.js reserves HOSTNAME for the server bind address.
 */
export const getAppUrlForJSONLD = (): string => (process.env.APP_URL ?? "").replace(/\/$/, "") || "";
