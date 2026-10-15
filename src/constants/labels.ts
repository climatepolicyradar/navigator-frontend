import { TSearchQueryGroup, TSearchQueryRule } from "@/types";

import { ID_SEPARATOR as SEP } from "./chars";

export const SUBNATIONAL_LABEL_TYPE = "level";

type TLabelDisplayReplacement = {
  parentId?: string;
  idMatch: string;
  // Replacements:
  type?: string;
  name?: string;
  subtitle?: string;
};

export const LABEL_DISPLAY_REPLACEMENTS: TLabelDisplayReplacement[] = [
  {
    idMatch: ["category", "Law"].join(SEP),
    name: "Laws",
  },
  {
    idMatch: ["category", "Policy"].join(SEP),
    name: "Policies",
  },
  {
    idMatch: `un_convention${SEP}`,
    type: "UN Convention",
  },
  {
    parentId: ["category", "Law"].join(SEP),
    idMatch: `topic${SEP}`,
    type: "Response Area",
  },
  {
    idMatch: ["group", "agent"].join(SEP),
    name: "Climate funds",
    subtitle: "Funding source of publisher",
  },
  {
    idMatch: ["group", "case_category"].join(SEP),
    name: "Case categories",
    subtitle: "Including industries, laws and topics",
  },
  {
    idMatch: ["group", "entity_type"].join(SEP),
    name: "Type",
    subtitle: "Project or guidance",
  },
  {
    idMatch: ["group", "jurisdiction"].join(SEP),
    name: "Jurisdictions",
    subtitle: "Publishing court or entity",
  },
  {
    idMatch: ["group", "principal_law"].join(SEP),
    name: "Principal laws",
    subtitle: "Organised by article and governing body",
  },
  {
    parentId: ["category", "Multilateral Climate Fund project"].join(SEP),
    idMatch: `agent${SEP}`,
    type: "Fund",
  },
  {
    parentId: ["category", "Multilateral Climate Fund project"].join(SEP),
    idMatch: `entity_type${SEP}`,
    type: "Document Type",
  },
  {
    parentId: ["category", "Global Stocktake"].join(SEP),
    idMatch: `author_type${SEP}`,
    type: "Type",
  },
];

type TLabelSearchReplacement = {
  idMatch: string;
  filter: TSearchQueryRule | TSearchQueryGroup;
};

export const LABEL_SEARCH_REPLACEMENTS: TLabelSearchReplacement[] = [
  {
    idMatch: ["level", "Country"].join(SEP),
    filter: {
      op: "and",
      filters: [
        {
          field: "labels.value.type",
          op: "contains",
          value: "country",
        },
        {
          field: "labels.value.type",
          op: "not_contains",
          value: "subdivision",
        },
        {
          field: "labels.value.id",
          op: "not_contains",
          value: ["country", "XAB"].join(SEP),
        },
        {
          field: "labels.value.id",
          op: "not_contains",
          value: ["country", "EUR"].join(SEP),
        },
      ],
    },
  },
  {
    idMatch: ["level", "Subdivision"].join(SEP),
    filter: {
      field: "labels.value.type",
      op: "contains",
      value: "subdivision",
    },
  },
];
