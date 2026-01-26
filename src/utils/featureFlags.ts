import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { TFeatureFlag, TFeatureFlags } from "@/types";

import { deleteCookie, setCookie } from "./cookies";
import getDomain from "./getDomain";

export const setFeatureFlags = (featureFlags: Partial<TFeatureFlags>) => {
  if (Object.keys(featureFlags).length === 0) {
    deleteCookie(`feature_flags`, getDomain());
    return;
  } else {
    setCookie(`feature_flags`, JSON.stringify(featureFlags), getDomain());
  }
};

export const getFeatureFlags = (
  // This is a replica of `NextApiRequestCookies`
  cookies: Partial<{
    [key: string]: string | string[];
  }>
): TFeatureFlags => {
  const featureFlags = { ...DEFAULT_FEATURE_FLAGS };

  if (cookies.feature_flags) {
    try {
      const featureFlagsCookie = Array.isArray(cookies.feature_flags) ? cookies.feature_flags[0] : cookies.feature_flags;
      const featureFlagsObject = JSON.parse(featureFlagsCookie);

      Object.keys(featureFlagsObject).forEach((key) => {
        if (key in featureFlags) featureFlags[key as TFeatureFlag] = featureFlagsObject[key] === true;
      });
    } catch (error) {
      /** it would be nice to alert to a beacon service, but we have none 😢 */
      console.error(error); // eslint-disable-line no-console
    }
  }

  return featureFlags;
};
