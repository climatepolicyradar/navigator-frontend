// Ensure no trailing slash on hostname - no guarantee that it will be present. Better to not assume either way.
export const getHostnameForJSONLD = () => process.env.HOSTNAME?.replace(/\/$/, "") || "";
