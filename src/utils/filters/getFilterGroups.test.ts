import { DEFAULT_FEATURES } from "@/constants/features";
import { TFeatures } from "@/types";

import { getFilterGroups } from "./getFilterGroups";

describe("getFilterGroups", () => {
  it.each<[Partial<TFeatures>, boolean]>([
    [{ themes: true }, true],
    [{ themes: false }, false],
  ])("with features %o shows domain filters: Should be %s", (features, expected) => {
    const groups = getFilterGroups({ features: { ...DEFAULT_FEATURES, ...features }, getAppText: () => "", theme: "cpr" });
    expect(groups.some((group) => group.rootLabelTypes.includes("domain"))).toBe(expected);
  });
});
