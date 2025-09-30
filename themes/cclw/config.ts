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
          "UNFCCC.corpus.i00000001.n0000",
          "UN.corpus.UNCCD.n0000",
          "UN.corpus.UNCBD.n0000",
          "CPR.corpus.Goldstandard.n0000",
        ],
      },
      {
        label: "UN",
        slug: "UN",
        value: ["UNFCCC.corpus.i00000001.n0000", "UN.corpus.UNCCD.n0000", "UN.corpus.UNCBD.n0000"],
        category: ["UNFCCC", "UNCCD", "UNCBD"],
      },
      {
        label: "Laws",
        slug: "laws",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "CPR.corpus.i00000001.n0000, CPR.corpus.Goldstandard.n0000"],
        category: ["Legislative"],
        alias: "LAWS",
      },
      {
        label: "Policies",
        slug: "policies",
        value: ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "CPR.corpus.i00000001.n0000, CPR.corpus.Goldstandard.n0000"],
        category: ["Executive"],
      },
    ],
  },
  filters: [
    {
      label: "UN Treaty",
      taxonomyKey: "un_treaty",
      startOpen: "true",
      options: [
        {
          label: "UNFCCC",
          slug: "unfccc",
          value: ["UNFCCC.corpus.i00000001.n0000"],
          corporaKey: "UNFCCC",
        },
        {
          label: "UNCCD",
          slug: "unccd",
          value: ["UN.corpus.UNCCD.n0000"],
          corporaKey: "UNCCD",
        },
        {
          label: "UNCBD",
          slug: "uncbd",
          value: ["UN.corpus.UNCBD.n0000"],
          corporaKey: "UNCBD",
        },
      ],
      type: "checkbox",
      category: [],
    },

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
          label: "Nationally Determined Contribution (NDC)",
          slug: "Nationally Determined Contribution",
          value: "Nationally Determined Contribution",
        },
        {
          label: "National Adaptation Plan (NAP)",
          slug: "National Adaptation Plan",
          value: "National Adaptation Plan",
        },
        {
          label: "Biennial Transparency Report (BTR)",
          slug: "Biennial Transparency Report",
          value: "Biennial Transparency Report",
        },
        {
          label: "Long-Term Low-Emission Development Strategy (LT-LEDS)",
          slug: "Long-Term Low-Emission Development Strategy",
          value: "Long-Term Low-Emission Development Strategy",
        },
        {
          label: "Biennial Update Report (BUR)",
          slug: "Biennial Update Report",
          value: "Biennial Update Report",
        },
        {
          label: "Biennial Report (BR)",
          slug: "Biennial Report",
          value: "Biennial Report",
        },
        {
          label: "National Communication (NC)",
          slug: "National Communication",
          value: "National Communication",
        },
        {
          label: "National Inventory Report (NIR)",
          slug: "National Inventory Report",
          value: "National Inventory Report",
        },
        {
          label: "Adaptation Communication (AC)",
          slug: "Adaptation Communication",
          value: "Adaptation Communication",
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
  documentCategories: ["All", "UNFCCC Submissions", "Laws", "Policies", "Litigation"],
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
    searchFamilySummary: true,
  },
};

export default config;
