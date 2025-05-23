import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  categories: {
    label: "Category",
    options: [
      {
        label: "All",
        slug: "All",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000591.n0000", "CPR.corpus.i00000592.n0000", "UNFCCC.corpus.i00000001.n0000"],
      },
      {
        label: "UNFCCC",
        slug: "UNFCCC",
        value: ["UNFCCC.corpus.i00000001.n0000"],
        category: ["UNFCCC"],
      },
      {
        label: "Policies",
        slug: "policies",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000"],
        category: ["Executive"],
      },
      {
        label: "Laws",
        slug: "laws",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000"],
        category: ["Legislative"],
        alias: "LAWS",
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
    {
      label: "Topic",
      taxonomyKey: "topic",
      apiMetaDataKey: "family.topic",
      type: "radio",
      category: ["CCLW.corpus.i00000001.n0000"],
      dependentFilterKey: "",
      corporaKey: "Laws and Policies",
    },
    {
      label: "Sector",
      taxonomyKey: "sector",
      apiMetaDataKey: "family.sector",
      type: "radio",
      category: ["CCLW.corpus.i00000001.n0000"],
      dependentFilterKey: "",
      showFade: "true",
      corporaKey: "Laws and Policies",
      quickSearch: "true",
    },
  ],
  labelVariations: [],
  links: [
    {
      key: "download-database",
      url: "https://form.jotform.com/233131638610347",
    },
  ],
  metadata: [
    {
      key: "default",
      title: "Climate Change Laws of the World",
      description:
        "The Climate Change Laws of the World database gives you access to national-level climate change legislation and policies from around the world.",
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
  documentCategories: ["All", "Laws", "Policies", "UNFCCC", "Litigation"],
};

export default config;
