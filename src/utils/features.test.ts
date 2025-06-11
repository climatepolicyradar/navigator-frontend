import { isFeatureEnabled } from "./features";

describe("isFeatureEnabled", () => {
  it("returns true with no config feature or feature flag", () => {
    expect(isFeatureEnabled({})).toBe(true);
  });

  it("returns true with an enabled config feature", () => {
    expect(isFeatureEnabled({ configFeature: true })).toBe(true);
  });

  it("returns false with an disabled config feature and no feature flag", () => {
    expect(isFeatureEnabled({ configFeature: false })).toBe(false);
  });

  it("returns true with an disabled config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: false, featureFlag: true })).toBe(true);
  });

  it("returns true with an enabled config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: true })).toBe(true);
  });

  it("returns true with an enabled config feature and a disabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: false })).toBe(true);
  });

  it("returns true with an unset config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: undefined, featureFlag: true })).toBe(true);
  });

  it("returns false with an unset config feature and a disabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: undefined, featureFlag: false })).toBe(false);
  });
});
