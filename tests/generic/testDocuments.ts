import { TTheme } from "@/types";

type TTestDocument = {
  titleForTests: string;
  slug: string;
  withSearch: string; // The search term that has passage matches on the document
  withTopic: string; // The topic that exists on the document
  withParentTopic: string; // The parent of the topic that exists on the document
  availableOn: TTheme[];
};

export const TEST_DOCUMENTS: TTestDocument[] = [
  {
    titleForTests: "UN Submission",
    slug: "malaysia-national-biodiversity-strategy-and-action-plan-nbsap-2023_3213",
    withSearch: "biodiversity",
    withTopic: "Target",
    withParentTopic: "Target",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Law",
    slug: "climate-strategy-2050_f664",
    withSearch: "target",
    withTopic: "Target",
    withParentTopic: "Target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy",
    slug: "strengthened-goals-net-zero-pledge-and-additional-climate-package_dead7",
    withSearch: "target",
    withTopic: "Target",
    withParentTopic: "Target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many documents",
    slug: "blue-economy-development-framework-for-indonesias-economic-transformation_7e1e",
    withSearch: "construction",
    withTopic: "Construction sector",
    withParentTopic: "Economic sector",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many main documents",
    slug: "the-fifth-carbon-budget_25eb",
    withSearch: "carbon",
    withTopic: "Greenhouse gas",
    withParentTopic: "Greenhouse gas",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, 70 targets",
    slug: "explainer-on-medium-and-long-term-plan-for-the-development-of-the-hydrogen-energy-industry-2021-2035_7bdc",
    withSearch: "hydrogen",
    withTopic: "Fossil fuel",
    withParentTopic: "Fossil fuel",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Climate Finance Project",
    slug: "extended-community-climate-change-project-flood-ecccp-flood_92fc",
    withSearch: "flood",
    withTopic: "Just transition",
    withParentTopic: "Just transition",
    availableOn: ["cpr", "mcf"],
  },
  {
    titleForTests: "Corporate Disclosure",
    slug: "2023-integrated-report-life-is-a-circle_cae9",
    withSearch: "resilience",
    withTopic: "Just transition",
    withParentTopic: "Just transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Wellbeing Budget",
    slug: "wellbeing-budget-2019_19a6",
    withSearch: "budget",
    withTopic: "Just transition",
    withParentTopic: "Just transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Litigation",
    slug: "lawsuit-filed-challenging-new-nepa-review-for-underground-coal-mines-expansion_9024",
    withSearch: "pollution",
    withTopic: "Coal",
    withParentTopic: "Fossil fuel",
    availableOn: ["ccc"],
  },
];
