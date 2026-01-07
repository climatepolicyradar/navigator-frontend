import { TThemeConfig } from "@/types";

import { DEFAULT_CONFIG_FEATURES } from "./features";

export const DEFAULT_THEME_CONFIG: TThemeConfig = {
  filters: [],
  labelVariations: {},
  links: [],
  metadata: [],
  documentCategories: ["All"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: [],
    geography: [],
  },
  tutorials: [],
  features: DEFAULT_CONFIG_FEATURES,
};
