import { PostHog } from "posthog-node";

/**
 * This key is a public key.
 * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
 */
const posthog = new PostHog("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
  host: "https://eu.i.posthog.com",
});

export async function getFeatureFlags(
  // This is a replica of `NextApiRequestCookies`
  cookies: Partial<{
    [key: string]: string | string[];
  }>
) {
  /**
   * There was no documentation found for this, nor for a standard way to do this.
   * It was taken from the implemtation we could see in the browser, so might be brittle.
   */
  const posthogCookieValue = Object.entries(cookies).find(([name]) => name.startsWith("ph_phc_") && name.endsWith("_posthog"))?.[1];
  let distinctId: string;
  if (posthogCookieValue) {
    try {
      const posthogCookiesJson = typeof posthogCookieValue === "string" ? posthogCookieValue : posthogCookieValue[0];
      distinctId = JSON.parse(posthogCookiesJson)?.distinct_id;
    } catch (error) {}
  }
  const flags = await posthog.getAllFlags(distinctId);
  return flags;
}
