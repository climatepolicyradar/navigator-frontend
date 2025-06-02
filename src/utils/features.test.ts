import { isFeatureEnabled } from "./features";

describe("isFeatureEnabled", () => {
  it("returns true with no config feature or feature flag", () => {
    expect(isFeatureEnabled({})).toBe(true);
  });

  it("returns true with an enabled config feature", () => {
    expect(isFeatureEnabled({ configFeature: true })).toBe(true);
  });

  it("returns false with an disabled config feature", () => {
    expect(isFeatureEnabled({ configFeature: false })).toBe(false);
  });

  it("returns false with an disabled config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: false, featureFlag: true })).toBe(false);
  });

  it("returns true with an enabled config feature and an enabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: true })).toBe(true);
  });

  it("returns false with an enabled config feature and a disabled feature flag", () => {
    expect(isFeatureEnabled({ configFeature: true, featureFlag: false })).toBe(false);
  });
});
