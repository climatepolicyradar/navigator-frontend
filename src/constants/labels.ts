import { ID_SEPARATOR as SEP } from "./chars";

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
