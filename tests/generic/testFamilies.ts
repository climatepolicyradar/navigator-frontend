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
    slug: "regulation-eu-2021-783-establishing-a-programme-for-the-environment-and-climate-action-life-and-repealing-regulation-eu-no-1293-2013_ec10",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy",
    slug: "tunisian-national-strategy-and-action-plan-for-biodiversity-2018-2030_a1d7",
    withSearch: "biodiversity",
    withTopic: "target",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Policy, many documents",
    slug: "national-green-growth-strategy_0ea0",
    withSearch: "National+Green+Growth+Strategy",
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
    titleForTests: "Policy, 60 targets",
    slug: "french-strategy-for-energy-and-climate_2d2e",
    withSearch: "fossil+fuel",
    withTopic: "fossil+fuel",
    availableOn: ["cpr", "cclw"],
  },
  {
    titleForTests: "Climate Finance Project",
    slug: "building-climate-resilience-by-linking-climate-adaptation-and-social-protection-through-decentralised-planning-in-mozambique-link_b173",
    withSearch: "resilience",
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
    titleForTests: "Offshore Wind Report",
    slug: "capturing-the-offshore-wind-opportunity-the-critical-role-of-ports-and-regional-coordination-in-scaling-offshore-wind-in-emerging-markets-and-developing-economies_7997",
    withSearch: "development",
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
