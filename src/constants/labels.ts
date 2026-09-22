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
    idMatch: ["group", "entity_type"].join(SEP),
    name: "Type",
    subtitle: "Project or guidance",
  },
];
