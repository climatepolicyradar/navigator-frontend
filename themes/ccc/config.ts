import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  defaultCorpora: ["Academic.corpus.Litigation.n0000"],
  filters: [],
  labelVariations: [
    {
      key: "date",
      label: "First published",
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
      title: "Sabin Center for Climate Change Law",
      description: "",
    },
    {
      key: "homepage",
      title: "Climate Change Litigation Databases",
      description:
        "Sabin Center for Climate Change Law provides two comprehensive databases of climate change caselaw - US Climate Change Litigation and Global Climate Change Litigation.",
    },
    {
      key: "geography",
      title: "{text} litigation",
      description: "Find climate change litigation data and indicators for {text}.",
    },
    {
      key: "search",
      title: "Search the Climate Case Chart database",
      description: "Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country.",
    },
  ],
  documentCategories: [],
  defaultDocumentCategory: null,
  features: {
    familyConceptsSearch: true,
    knowledgeGraph: false,
    litigation: true,
    searchFamilySummary: true,
    vespaSearchOnGeographies: false,
  },
};

export default config;
