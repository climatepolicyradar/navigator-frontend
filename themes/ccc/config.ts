import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  defaultCorpora: ["Academic.corpus.Litigation.n0000"],
  filters: [],
  labelVariations: {
    date: {
      label: "Filing year",
      category: [],
    },
  },
  links: {
    downloadDatabase: "https://form.jotform.com/252292116187356",
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
    familyConceptsSearch: true,
    knowledgeGraph: true,
    litigation: true,
    searchFamilySummary: true,
  },
};

export default config;
