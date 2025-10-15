import { DEFAULT_CONFIG_FEATURES } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TThemeConfig } from "@/types";

import { buildSearchQueryMetadata } from "./buildSearchQueryMetadata";

const testThemeConfig: TThemeConfig = {
  ...DEFAULT_THEME_CONFIG,
  filters: [
    {
      label: "Status",
      taxonomyKey: "status",
      apiMetaDataKey: "family.status",
      type: "radio",
      category: ["corpus1", "corpus2", "corpus3", "corpus4"],
      dependentFilterKey: "fund",
    },
  ],
  features: {
    ...DEFAULT_CONFIG_FEATURES,
    searchFamilySummary: true,
  },
};

describe("buildSearchQueryMetadata: ", () => {
  it("should return an array of a single value if the metadata is previously empty", () => {
    const metadata = "Test Status";

    const searchQueryMetadata = buildSearchQueryMetadata([], metadata, "status", testThemeConfig);

    expect(searchQueryMetadata).toEqual([{ name: "family.status", value: "Test Status" }]);
  });

  it("should return an array of two values if we provide 2 and the metadata is previously empty", () => {
    const metadata = ["Test Status 1", "Test Status 2"];

    const searchQueryMetadata = buildSearchQueryMetadata([], metadata, "status", testThemeConfig);

    expect(searchQueryMetadata).toEqual([
      { name: "family.status", value: "Test Status 1" },
      { name: "family.status", value: "Test Status 2" },
    ]);
  });

  it("should return the new value if we provide one value and the metadata previously contains a different value", () => {
    const metadata = "Test Status";

    const searchQueryMetadata = buildSearchQueryMetadata([{ name: "family.status", value: "Existing Status" }], metadata, "status", testThemeConfig);

    expect(searchQueryMetadata).toEqual([{ name: "family.status", value: "Test Status" }]);
  });

  it("should not add the new value, if the options is not present in our config", () => {
    const metadata = "Test Status";

    const searchQueryMetadata = buildSearchQueryMetadata([], metadata, "valueNotPresent", testThemeConfig);

    expect(searchQueryMetadata).toEqual([]);
  });

  it("should return empty if we provide nothing", () => {
    const searchQueryMetadata = buildSearchQueryMetadata([], "", "status", testThemeConfig);

    expect(searchQueryMetadata).toEqual([]);
  });

  it("should return empty if we provide an empty string", () => {
    const metadata = "";

    const searchQueryMetadata = buildSearchQueryMetadata([], metadata, "status", testThemeConfig);

    expect(searchQueryMetadata).toEqual([]);
  });
});
