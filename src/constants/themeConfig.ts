import { TThemeConfig } from "@/types";

import { DEFAULT_CONFIG_FEATURES } from "./features";

const DEFAULT_PAGE_METADATA = { title: "", description: "" };

export const DEFAULT_THEME_CONFIG: TThemeConfig = {
  filters: [],
  labelVariations: {},
  links: {},
  pageMetadata: {
    default: DEFAULT_PAGE_METADATA,
    homepage: DEFAULT_PAGE_METADATA,
    geography: DEFAULT_PAGE_METADATA,
    search: DEFAULT_PAGE_METADATA,
  },
  documentCategories: ["All"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: [],
    geography: [],
  },
  tutorials: [],
  features: DEFAULT_CONFIG_FEATURES,
};
