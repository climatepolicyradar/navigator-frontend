import { describe, expect, it } from "vitest";

import { TFeatures } from "@/types";

import { getDirectLinkRedirect } from "./getDirectLinkRedirect";

const features = (isNewSearch: boolean): TFeatures => ({ "new-search": isNewSearch }) as TFeatures;

describe("getDirectLinkRedirect", () => {
  it("returns null when data is null", () => {
    expect(getDirectLinkRedirect(null, "slug", features(true))).toBeNull();
  });

  it("returns null when new search is not live, even with a policy", () => {
    expect(getDirectLinkRedirect({ directLinkPolicy: { action: "not_found" } }, "slug", features(false))).toBeNull();
  });

  it("returns null when there is no policy", () => {
    expect(getDirectLinkRedirect({ directLinkPolicy: null }, "slug", features(true))).toBeNull();
  });

  it("returns notFound for a not_found policy once new search is live", () => {
    expect(getDirectLinkRedirect({ directLinkPolicy: { action: "not_found" } }, "slug", features(true))).toEqual({ notFound: true });
  });

  it("returns a redirect with the slug interpolated once new search is live", () => {
    expect(
      getDirectLinkRedirect({ directLinkPolicy: { action: "redirect", to: "https://example.com/document/{id}" } }, "slug", features(true))
    ).toEqual({
      redirect: { destination: "https://example.com/document/slug", permanent: false },
    });
  });
});
