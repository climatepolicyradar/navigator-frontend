import { deleteCookie, setCookie } from "./cookies";
import getDomain from "./getDomain";

export function setFeatureFlags(featureFlags: Partial<{ [key: string]: true }>) {
  if (Object.keys(featureFlags).length === 0) {
    deleteCookie(`feature_flags`, getDomain());
    return;
  } else {
    setCookie(`feature_flags`, JSON.stringify(featureFlags), getDomain());
  }
}

export type TFeatureFlags = Partial<{ [key: string]: true }>;

export async function getFeatureFlags(
  // This is a replica of `NextApiRequestCookies`
  cookies: Partial<{
    [key: string]: string | string[];
  }>
) {
  let featureFlags: TFeatureFlags = {};
  if (cookies.feature_flags) {
    try {
      const featureFlagsCookie = Array.isArray(cookies.feature_flags) ? cookies.feature_flags[0] : cookies.feature_flags;
      featureFlags = JSON.parse(featureFlagsCookie);
    } catch (e) {
      /** it would be nice to alert to a beacon service, but we have none 😢 */
    }
  }

  return featureFlags;
}
