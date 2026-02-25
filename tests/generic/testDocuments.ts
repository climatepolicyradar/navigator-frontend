import { TTheme } from "@/types";

type TTestDocument = {
  titleForTests: string;
  slug: string;
  withSearch: string; // The URL param value of a search that has passage matches on the document
  withTopic: string; // The URL param value of a topic that exists on the document
  availableOn: TTheme[];
};

export const TEST_DOCUMENTS: TTestDocument[] = [
  {
    titleForTests: "UN Submission",
    slug: "malaysia-national-biodiversity-strategy-and-action-plan-nbsap-2023_3213",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Law",
    slug: "regulation-eu-2021-783-establishing-a-programme-for-the-environment-and-climate-action-life_556a",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy",
    slug: "national-strategy-and-action-plan-for-biodiversity-2018-2030_a435",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many documents",
    slug: "decision-introducing-the-natural-resources-and-environment-action-program-for-implementation-of-the-national-green-growth-strategy-8d83",
    withSearch: "National+Green+Growth+Strategy",
    withTopic: "construction+sector",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many main documents",
    slug: "co2-ordinance_19d6",
    withSearch: "emissions",
    withTopic: "greenhouse+gas",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, 60 targets",
    slug: "french-strategy-for-energy-and-climate_4282",
    withSearch: "fossil+fuel",
    withTopic: "fossil+fuel",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Climate Finance Project",
    slug: "building-climate-resilience-by-linking-climate-adaptation-and-social-protection-through-decentralised-planning-in-mozambique-link_f885",
    withSearch: "resilience",
    withTopic: "just+transition",
    availableOn: ["cpr", "mcf"],
  },
  {
    titleForTests: "Corporate Disclosure",
    slug: "2023-integrated-report-life-is-a-circle_cae9",
    withSearch: "resilience",
    withTopic: "just+transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Offshore Wind Report",
    slug: "capturing-the-offshore-wind-opportunity-the-critical-role-of-ports-and-regional-coordination-in-scaling-offshore-wind-in-emerging-markets-and-developing-economies_a93c",
    withSearch: "development",
    withTopic: "just+transition",
    availableOn: ["cpr"],
  },
  {
    titleForTests: "Litigation",
    slug: "lawsuit-filed-challenging-new-nepa-review-for-underground-coal-mines-expansion_9024",
    withSearch: "pollution",
    withTopic: "coal",
    availableOn: ["ccc"],
  },
];
