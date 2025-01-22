import { deleteCookie, setCookie } from "./cookies";
import getDomain from "./getDomain";

export function enableFeatureFlagCookie(flagKey: string) {
  setCookie(`feature_flag_${flagKey}`, "true", getDomain());
}
export function deleteFeatureFlagCookie(flagKey: string) {
  deleteCookie(`feature_flag_${flagKey}`, getDomain());
}

export async function getFeatureFlags(
  // This is a replica of `NextApiRequestCookies`
  cookies: Partial<{
    [key: string]: string | string[];
  }>
) {
  const flags: Partial<{ [key: string]: true }> = {};

  Object.entries(cookies).map(([key, value]) => {
    if (key.startsWith("feature_flag_")) {
      const flagKey = key.replace("feature_flag_", "");
      if (value === "true") {
        flags[flagKey] = true;
      }
    }
  });
  return flags;
}
