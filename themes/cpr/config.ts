import { TThemeConfig } from "@/types";

const config: TThemeConfig = {
  categories: {
    label: "Document Type",
    options: [
      {
        label: "All",
        slug: "All",
        value: [
          "CCLW.corpus.i00000001.n0000",
          "CPR.corpus.Goldstandard.n0000",
          "CPR.corpus.i00000001.n0000",
          "CPR.corpus.i00000589.n0000",
          "CPR.corpus.i00000591.n0000",
          "CPR.corpus.i00000592.n0000",
          "MCF.corpus.AF.Guidance",
          "MCF.corpus.AF.n0000",
          "MCF.corpus.CIF.Guidance",
          "MCF.corpus.CIF.n0000",
          "MCF.corpus.GCF.Guidance",
          "MCF.corpus.GCF.n0000",
          "MCF.corpus.GEF.Guidance",
          "MCF.corpus.GEF.n0000",
          "OEP.corpus.i00000001.n0000",
          "UNFCCC.corpus.i00000001.n0000",
        ],
      },
      {
        label: "UNFCCC Submissions",
        slug: "UNFCCC",
        value: ["UNFCCC.corpus.i00000001.n0000"],
        category: ["UNFCCC"],
      },
      {
        label: "Laws",
        slug: "laws",
        value: [
          "CCLW.corpus.i00000001.n0000",
          "CPR.corpus.i00000001.n0000",
          "CPR.corpus.i00000589.n0000",
          "CPR.corpus.i00000591.n0000",
          "CPR.corpus.i00000592.n0000",
          "CPR.corpus.Goldstandard.n0000",
        ],
        category: ["Legislative"],
        alias: "LAWS",
      },
      {
        label: "Policies",
        slug: "policies",
        value: [
          "CCLW.corpus.i00000001.n0000",
          "CPR.corpus.i00000001.n0000",
          "CPR.corpus.i00000589.n0000",
          "CPR.corpus.i00000591.n0000",
          "CPR.corpus.i00000592.n0000",
          "CPR.corpus.Goldstandard.n0000",
        ],
        category: ["Executive"],
      },
      {
        label: "Climate Finance Projects",
        slug: "climate-finance-projects",
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
        label: "Corporate Disclosures",
        slug: "corporate-disclosures",
        value: ["CPR.corpus.i00000002.n0000"],
      },
      {
        label: "Offshore Wind Reports",
        slug: "offshore-wind-reports",
        value: ["OEP.corpus.i00000001.n0000"],
      },
      {
        label: "Litigation (coming soon)",
        slug: "Litigation",
        category: ["Litigation"],
        value: ["LITIGATION-COMING-SOON"],
      },
    ],
  },
  filters: [
    {
      label: "Funds",
      taxonomyKey: "fund",
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
      category: [
        "MCF.corpus.GCF.n0000",
        "MCF.corpus.GEF.n0000",
        "MCF.corpus.AF.n0000",
        "MCF.corpus.CIF.n0000",
        "MCF.corpus.AF.Guidance",
        "MCF.corpus.CIF.Guidance",
        "MCF.corpus.GEF.Guidance",
        "MCF.corpus.GCF.Guidance",
      ],
      startOpen: "true",
    },
    {
      label: "Type",
      taxonomyKey: "fund_doc_type",
      apiMetaDataKey: "",
      type: "radio",
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
      category: [
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
      category: [
        "CCLW.corpus.i00000001.n0000",
        "CPR.corpus.i00000589.n0000",
        "CPR.corpus.i00000591.n0000",
        "CPR.corpus.i00000592.n0000",
        "CPR.corpus.Goldstandard.n0000",
      ],
      dependentFilterKey: "",
      corporaKey: "Laws and Policies",
      showTopicsMessage: true,
    },
    {
      label: "Sector",
      taxonomyKey: "sector",
      apiMetaDataKey: "family.sector",
      type: "radio",
      category: [
        "CCLW.corpus.i00000001.n0000",
        "CPR.corpus.i00000589.n0000",
        "CPR.corpus.i00000591.n0000",
        "CPR.corpus.i00000592.n0000",
        "CPR.corpus.Goldstandard.n0000",
      ],
      dependentFilterKey: "",
      showFade: "true",
      corporaKey: "Laws and Policies",
      quickSearch: "true",
      showTopicsMessage: true,
    },
    {
      label: "Author Type",
      taxonomyKey: "author_type",
      apiMetaDataKey: "family.author_type",
      type: "radio",
      category: ["OEP.corpus.i00000001.n0000"],
      corporaKey: "Reports",
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
      title: "Climate Policy Radar",
      description:
        "Use Climate Policy Radar's data science and AI-powered platform to search and explore thousands of climate change laws, policies and legal cases worldwide.",
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
  documentCategories: ["All", "UNFCCC Submissions", "Laws", "Policies", "Climate Finance Projects", "Offshore Wind Reports", "Litigation"],
  defaultDocumentCategory: "Laws",
  features: {
    familyConceptsSearch: false,
    knowledgeGraph: true,
    litigation: false,
    searchFamilySummary: false,
  },
};

export default config;
