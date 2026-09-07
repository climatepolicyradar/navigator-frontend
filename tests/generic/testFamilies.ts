import { TTheme } from "@/types";

type TTestFamily = {
  titleForTests: string;
  slug: string;
  withSearch: string; // The URL param value of a search that has passage matches on a document in the family
  withTopic: string; // The URL param value of a topic that exists on the family
  availableOn: TTheme[];
};

export const TEST_FAMILIES: TTestFamily[] = [
  {
    titleForTests: "UN Submission",
    slug: "malaysia-national-biodiversity-strategy-and-action-plan-nbsap-2023_1c6d",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Law",
    slug: "climate-strategy-2050_5c70",
    withSearch: "target",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy",
    slug: "national-policy-on-biological-diversity_b248",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many documents",
    slug: "blue-economy-development-framework-for-indonesias-economic-transformation_ebbb",
    withSearch: "construction",
    withTopic: "construction+sector",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many main documents",
    slug: "regulation-on-the-co2-emission-for-new-passenger-vehicles_8e7c",
    withSearch: "emissions",
    withTopic: "greenhouse+gas",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, 80 targets",
    slug: "medium-and-long-term-plan-for-the-development-of-the-hydrogen-energy-industry-2021-2035_37a6",
    withSearch: "hydrogen",
    withTopic: "fossil+fuel",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Climate Finance Project",
    slug: "extended-community-climate-change-project-flood-ecccp-flood_bf95",
    withSearch: "flood",
    withTopic: "just+transition",
    availableOn: ["cpr", "mcf"],
  },
  {
    titleForTests: "Corporate Disclosure",
    slug: "a2a-s-p-a-annual-mandatory-report-2023_f149",
    withSearch: "resilience",
    withTopic: "just+transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Wellbeing Budget",
    slug: "wellbeing-budget_77af",
    withSearch: "budget",
    withTopic: "just+transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Litigation",
    slug: "350-montana-v-haaland_3eb6",
    withSearch: "pollution",
    withTopic: "coal",
    availableOn: ["ccc"],
  },
];
