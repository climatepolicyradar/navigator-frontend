import { featureFlagKeys, TFeatureFlags } from "src/types/features";

import { deleteCookie, setCookie } from "./cookies";
import getDomain from "./getDomain";

export function setFeatureFlags(featureFlags: Partial<TFeatureFlags>) {
  if (Object.keys(featureFlags).length === 0) {
    deleteCookie(`feature_flags`, getDomain());
    return;
  } else {
    setCookie(`feature_flags`, JSON.stringify(featureFlags), getDomain());
  }
}

export const getFeatureFlags = async (
  // This is a replica of `NextApiRequestCookies`
  cookies: Partial<{
    [key: string]: string | string[];
  }>
): Promise<TFeatureFlags> => {
  const featureFlags = Object.fromEntries(featureFlagKeys.map((flag) => [flag, false])) as TFeatureFlags;

  if (cookies.feature_flags) {
    try {
      const featureFlagsCookie = Array.isArray(cookies.feature_flags) ? cookies.feature_flags[0] : cookies.feature_flags;
      const featureFlagsObject = JSON.parse(featureFlagsCookie);

      Object.keys(featureFlagsObject).forEach((key) => {
        if (key in featureFlags) featureFlags[key] = featureFlagsObject[key] === true;
      });
    } catch (error) {
      /** it would be nice to alert to a beacon service, but we have none 😢 */
      console.error(error); // eslint-disable-line no-console
    }
  }

  return featureFlags;
};
