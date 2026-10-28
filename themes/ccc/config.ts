import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  documentTypeLabels: [],
  defaultCorpora: ["Academic.corpus.Litigation.n0000"],
  deprecatedFilters: [],
  searchCategories: ["Litigation"],
  searchExcludeLabels: [],
  downloadColumns: [
    "ID",
    "TITLE",
    "DESCRIPTION",
    "BUNDLE_ID",
    "BUNDLE_TITLE",
    "GEOGRAPHIES",
    "PUBLISHED_DATE",
    "CASE_STATUS",
    "CASE_NUMBER",
    "AT_ISSUE",
    "ORIGINAL_CASE_NAME",
    "PRINCIPAL_LAWS",
    "CASE_CATEGORIES",
    "JURISDICTIONS",
  ],
  labelVariations: {
    date: {
      label: "Filing year",
      category: [],
    },
  },
  links: {
    cookiePolicy: "/cookie-policy",
    downloadDatabase: "https://form.jotform.com/252292116187356",
    leaveFeedback: "https://form.jotform.com/252292443502350",
    privacyPolicy: "/privacy-policy",
    targetDomain: "https://app.climatepolicyradar.org",
  },
  pageMetadata: {
    default: {
      title: "The Climate Litigation Database",
      description: "",
    },
    homepage: {
      title: "The Climate Litigation Database",
      description:
        "Sabin Center for Climate Change Law provides Climate Litigation Database, a comprehensive database of US and Global climate change caselaw",
    },
    geography: {
      title: "{text} litigation",
      description: "Find climate change litigation data and indicators for {text}.",
    },
    search: {
      title: "Search the Climate Litigation Database",
      description: "Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country.",
    },
  },
  documentCategories: ["All"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: ["metadata", "documents", "summary", "topics"],
    geography: ["recents", "subdivisions"],
  },
  tutorials: ["climateLitigationDatabase", "knowledgeGraph"],
  features: {
    // Only toggle to true here when you want the COP31 content to go live.
    // Until then it stays false and the PostHog flag (0% rollout) controls access.
    "climate-cop31-2026": false,
    familyConceptsSearch: true,
    // Deliberately off while subdivisions is on: ~95% of US federal cases also carry a state
    // subdivision tag, so "Type: Country" would hide almost all of them. Needs the litigation
    // geography data resolving (court level vs geography) before this can go live here.
    "geography-type-filters": false,
    knowledgeGraph: true,
    litigation: true,
    "new-search": false,
    searchFamilySummary: true,
    subdivisions: true,
    themes: false,
  },
};

export default config;
