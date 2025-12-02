import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  defaultCorpora: [
    "MCF.corpus.GCF.n0000",
    "MCF.corpus.GEF.n0000",
    "MCF.corpus.AF.n0000",
    "MCF.corpus.CIF.n0000",
    "MCF.corpus.AF.Guidance",
    "MCF.corpus.CIF.Guidance",
    "MCF.corpus.GEF.Guidance",
    "MCF.corpus.GCF.Guidance",
  ],
  filters: [
    {
      label: "Climate funds",
      taxonomyKey: "fund",
      startOpen: "true",
      options: [
        {
          label: "Adaptation Fund",
          slug: "adaptation-fund",
          value: ["MCF.corpus.AF.n0000", "MCF.corpus.AF.Guidance"],
          corporaKey: "AF",
        },
        {
          label: "Climate Investment Funds",
          slug: "climate-investment-funds",
          value: ["MCF.corpus.CIF.n0000", "MCF.corpus.CIF.Guidance"],
          corporaKey: "CIF",
        },
        {
          label: "Global Environment Facility",
          slug: "global-environment-facility",
          value: ["MCF.corpus.GEF.n0000", "MCF.corpus.GEF.Guidance"],
          corporaKey: "GEF",
        },
        {
          label: "Green Climate Fund",
          slug: "green-climate-fund",
          value: ["MCF.corpus.GCF.n0000", "MCF.corpus.GCF.Guidance"],
          corporaKey: "GCF",
        },
      ],
      type: "checkbox",
      category: [],
    },
    {
      label: "Type",
      taxonomyKey: "fund_doc_type",
      apiMetaDataKey: "",
      type: "radio",
      startOpen: "true",
      options: [
        {
          label: "All",
          slug: "all",
          value: [
            "MCF.corpus.GCF.n0000",
            "MCF.corpus.GEF.n0000",
            "MCF.corpus.AF.n0000",
            "MCF.corpus.CIF.n0000",
            "MCF.corpus.AF.Guidance",
            "MCF.corpus.CIF.Guidance",
            "MCF.corpus.GEF.Guidance",
            "MCF.corpus.GCF.Guidance",
          ],
        },
        {
          label: "Projects",
          slug: "projects",
          value: ["MCF.corpus.GCF.n0000", "MCF.corpus.GEF.n0000", "MCF.corpus.AF.n0000", "MCF.corpus.CIF.n0000"],
        },
        {
          label: "Guidance",
          slug: "guidance",
          value: ["MCF.corpus.AF.Guidance", "MCF.corpus.CIF.Guidance", "MCF.corpus.GEF.Guidance", "MCF.corpus.GCF.Guidance"],
        },
      ],
      category: [],
    },
    {
      label: "Status",
      taxonomyKey: "status",
      apiMetaDataKey: "family.status",
      type: "radio",
      category: ["projects"],
      categoryKey: "fund_doc_type",
      dependentFilterKey: "fund",
    },
    {
      label: "Implementing agency",
      taxonomyKey: "implementing_agency",
      apiMetaDataKey: "family.implementing_agency",
      type: "radio",
      category: ["projects"],
      categoryKey: "fund_doc_type",
      showFade: "true",
      dependentFilterKey: "fund",
      quickSearch: "true",
    },
  ],
  labelVariations: [
    {
      key: "date",
      label: "Approval FY",
      category: [],
    },
  ],
  links: [
    {
      key: "download-database",
      url: "https://form.jotform.com/242902819253357",
    },
  ],
  metadata: [
    {
      key: "default",
      title: "Climate Project Explorer",
      description: "",
    },
    {
      key: "homepage",
      title: "Climate Fund Search",
      description:
        "Climate Project Explorer is a single point of entry for navigating and exploring the MCF's documents (including project documents and policies).",
    },
    {
      key: "geography",
      title: "{text} climate projects",
      description: "Find climate projects for {text}.",
    },
    {
      key: "search",
      title: "Search the Climate Project Explorer database",
      description: "Quickly and easily search through the complete text of thousands of project documents.",
    },
  ],
  documentCategories: ["All"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: ["summary", "documents", "metadata", "topics", "collections", "note"],
    geography: ["recents"],
  },
  tutorials: ["knowledgeGraph"],
  features: {
    familyConceptsSearch: false,
    knowledgeGraph: true,
    litigation: false,
    newPageDesigns: false,
    searchFamilySummary: true,
    rioPolicyRadar: false,
  },
};

export default config;
