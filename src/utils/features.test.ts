import { isFeatureEnabled } from "./features";

describe("isFeatureEnabled", () => {
  it("returns true with no config feature or feature flag", () => {
    expect(isFeatureEnabled({})).toBe(true);
  });

  it("returns true with an enabled config feature", () => {
    expect(isFeatureEnabled({ configFeature: true })).toBe(true);
  });

  it("returns false when disabled in the config & feature flag turned off", () => {
    expect(isFeatureEnabled({ configFeature: false })).toBe(false);
  });

  it("returns true when disabled in the theme config AND feature flag is enabled", () => {
    expect(isFeatureEnabled({ configFeature: false, featureFlag: true })).toBe(true);
  });

  it("returns true when enabled in the theme config AND feature flag is enabled", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: true })).toBe(true);
  });

  it("returns true when enabled in the theme config AND feature flag is disabled", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: false })).toBe(true);
  });

  it("returns true with an unset config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: undefined, featureFlag: true })).toBe(true);
  });

  it("returns false with an unset config feature and a disabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: undefined, featureFlag: false })).toBe(false);
  });
});
