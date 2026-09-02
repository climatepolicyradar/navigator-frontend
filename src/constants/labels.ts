import { ID_SEPARATOR as SEP } from "./chars";

type TLabelDisplayReplacement = {
  parentId?: string;
  idMatch: string;
  type?: string;
  name?: string;
};

export const LABEL_DISPLAY_REPLACEMENTS: TLabelDisplayReplacement[] = [
  {
    idMatch: `un_convention${SEP}`,
    type: "UN Convention",
  },
  {
    parentId: `category${SEP}Law`,
    idMatch: `topic${SEP}`,
    type: "Response Area",
  },
];
