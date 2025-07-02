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
      key: "default",
      title: "Climate Case Chart",
      description: "WIP",
    },
    {
      key: "geography",
      title: "{text} climate laws and policies",
      description:
        "Find climate change laws, policies, targets and other climate policy data and indicators for {text}, alongside information about their legislative process.",
    },
    {
      key: "search",
      title: "Law and Policy Search",
      description: "Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country.",
    },
  ],
  documentCategories: ["All", "Laws", "Policies", "UNFCCC Submissions", "Litigation", "Climate Finance Projects", "Industry Reports"],
  defaultDocumentCategory: "All",
  features: {
    knowledgeGraph: false,
    searchFamilySummary: true,
    familyConceptsSearch: true,
  },
};

export default config;
