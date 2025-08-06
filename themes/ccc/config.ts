import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  categories: {
    label: "Category",
    options: [
      {
        label: "All",
        slug: "All",
        value: ["Academic.corpus.Litigation.n0000"],
      },
      {
        label: "Litigation",
        slug: "Litigation",
        value: ["Academic.corpus.Litigation.n0000"],
        category: ["Litigation"],
      },
    ],
  },
  filters: [
    {
      label: "Type",
      taxonomyKey: "framework_laws",
      apiMetaDataKey: "family.framework",
      type: "checkbox",
      category: ["LAWS"],
      startOpen: "true",
      options: [
        {
          label: "Framework laws",
          slug: "true",
          value: "true",
          additionalInfo: "Framework laws create overarching governance structures for countries' climate policy responses.",
          learnMoreUrl: "/framework-laws",
        },
      ],
    },
  ],
  labelVariations: [
    {
      key: "date",
      label: "First published",
      category: ["MCF.corpus.GCF.n0000", "MCF.corpus.GEF.n0000", "MCF.corpus.AF.n0000", "MCF.corpus.CIF.n0000"],
    },
  ],
  links: [
    {
      key: "download-database",
      url: "https://form.jotform.com/250202141318339",
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
  documentCategories: ["All", "Laws", "Policies", "UNFCCC Submissions", "Litigation", "Climate Finance Projects", "Offshore Wind Reports"],
  defaultDocumentCategory: "All",
  features: {
    familyConceptsSearch: true,
    knowledgeGraph: false,
    litigation: true,
    searchFamilySummary: true,
  },
};

export default config;
