import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  defaultCorpora: ["Academic.corpus.Litigation.n0000"],
  filters: [],
  labelVariations: [
    {
      key: "date",
      label: "Filing year",
      category: [],
    },
  ],
  links: [
    {
      key: "download-database",
      url: "https://form.jotform.com/252292116187356",
    },
  ],
  metadata: [
    {
      // default - used for app title (i.e. on each page after the title)
      key: "default",
      title: "The Climate Litigation Database",
      description: "",
    },
    {
      key: "homepage",
      title: "The Climate Litigation Database",
      description:
        "Sabin Center for Climate Change Law provides Climate Litigation Database, a comprehensive database of US and Global climate change caselaw",
    },
    {
      key: "geography",
      title: "{text} litigation",
      description: "Find climate change litigation data and indicators for {text}.",
    },
    {
      key: "search",
      title: "Search the Climate Litigation Database",
      description: "Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country.",
    },
  ],
  documentCategories: ["All"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: ["metadata", "documents", "summary"],
    geography: ["recents", "subdivisions"],
  },
  tutorials: ["climateLitigationDatabase"],
  features: {
    familyConceptsSearch: true,
    knowledgeGraph: false,
    litigation: true,
    newPageDesigns: true,
    searchFamilySummary: true,
  },
};

export default config;
