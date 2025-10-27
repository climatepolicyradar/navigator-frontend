import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  categories: {
    label: "Category",
    options: [
      {
        label: "All",
        slug: "All",
        value: [
          "CCLW.corpus.i00000001.n0000",
          "CPR.corpus.i00000001.n0000",
          "CPR.corpus.i00000591.n0000",
          "CPR.corpus.i00000592.n0000",
          "UNFCCC.corpus.i00000001.n0000",
          "CPR.corpus.Goldstandard.n0000",
        ],
      },
      {
        label: "UN Submissions",
        slug: "UNFCCC",
        value: ["UNFCCC.corpus.i00000001.n0000"],
        category: ["UNFCCC"],
      },
      {
        label: "Laws",
        slug: "laws",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "CPR.corpus.i00000001.n0000", "CPR.corpus.Goldstandard.n0000"],
        category: ["Legislative"],
        alias: "LAWS",
      },
      {
        label: "Policies",
        slug: "policies",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "CPR.corpus.i00000001.n0000", "CPR.corpus.Goldstandard.n0000"],
        category: ["Executive"],
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
      label: "Response areas",
      taxonomyKey: "topic",
      apiMetaDataKey: "family.topic",
      type: "radio",
      category: ["CCLW.corpus.i00000001.n0000"],
      dependentFilterKey: "",
      corporaKey: "Laws and Policies",
      showTopicsMessage: true,
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
      showTopicsMessage: true,
    },
    {
      label: "Author Type",
      corporaKey: "Intl. agreements",
      taxonomyKey: "author_type",
      apiMetaDataKey: "family.author_type",
      type: "radio",
      category: ["UNFCCC.corpus.i00000001.n0000"],
    },
    {
      label: "Type of submission",
      corporaKey: "Intl. agreements",
      taxonomyKey: "_document.type",
      apiMetaDataKey: "document.type",
      type: "radio",
      category: ["UNFCCC.corpus.i00000001.n0000"],
      options: [
        {
          label: "National Biodiversity Strategy and Action Plan (NBSAP)",
          slug: "National Biodiversity Strategy and Action Plan",
          value: "National Biodiversity Strategy and Action Plan",
          group: "CBD",
        },
        {
          label: "National Report (NR)",
          slug: "National Report",
          value: "National Report",
          group: "CBD",
        },
        {
          label: "Nationally Determined Contribution (NDC)",
          slug: "Nationally Determined Contribution",
          value: "Nationally Determined Contribution",
          group: "UNFCCC",
        },
        {
          label: "National Adaptation Plan (NAP)",
          slug: "National Adaptation Plan",
          value: "National Adaptation Plan",
          group: "UNFCCC",
        },
        {
          label: "Biennial Transparency Report (BTR)",
          slug: "Biennial Transparency Report",
          value: "Biennial Transparency Report",
          group: "UNFCCC",
        },
        {
          label: "Long-Term Low-Emission Development Strategy (LT-LEDS)",
          slug: "Long-Term Low-Emission Development Strategy",
          value: "Long-Term Low-Emission Development Strategy",
          group: "UNFCCC",
        },
        {
          label: "Biennial Update Report (BUR)",
          slug: "Biennial Update Report",
          value: "Biennial Update Report",
          group: "UNFCCC",
        },
        {
          label: "Biennial Report (BR)",
          slug: "Biennial Report",
          value: "Biennial Report",
          group: "UNFCCC",
        },
        {
          label: "National Communication (NC)",
          slug: "National Communication",
          value: "National Communication",
          group: "UNFCCC",
        },
        {
          label: "National Inventory Report (NIR)",
          slug: "National Inventory Report",
          value: "National Inventory Report",
          group: "UNFCCC",
        },
        {
          label: "Adaptation Communication (AC)",
          slug: "Adaptation Communication",
          value: "Adaptation Communication",
          group: "UNFCCC",
        },
        {
          label: "Voluntary Land Degradation Neutrality Targets (LDN-T)",
          slug: "Voluntary Land Degradation Neutrality Targets",
          value: "Voluntary Land Degradation Neutrality Targets",
          group: "UNCCD",
        },
        {
          label: "Country Report (CR)",
          slug: "Country Report",
          value: "Country Report",
          group: "UNCCD",
        },
        {
          label: "National Drought Plan (NDP)",
          slug: "National Drought Plan",
          value: "National Drought Plan",
          group: "UNCCD",
        },
      ],
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
      // default - used for app title (i.e. on each page after the title)
      key: "default",
      title: "Climate Change Laws of the World",
      description: "",
    },
    {
      key: "homepage",
      title: "Law and Policy Search",
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
      title: "Search the Climate Change Laws of the World database",
      description: "Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country.",
    },
  ],
  documentCategories: ["All", "UN Submissions", "Laws", "Policies", "Litigation"],
  defaultDocumentCategory: "All",
  pageBlocks: {
    family: [],
    geography: [],
  },
  tutorials: ["knowledgeGraph"],
  features: {
    familyConceptsSearch: false,
    knowledgeGraph: true,
    litigation: false,
    newPageDesigns: false,
    searchFamilySummary: true,
  },
};

export default config;
