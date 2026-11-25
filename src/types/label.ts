import { ID_SEPARATOR } from "@/constants/chars";

// The most generic label type
export type TLabel = {
  id: string;
  type: string;
  value: string;
  children?: TLabel[];
};

export type TLabelId = `${string}${typeof ID_SEPARATOR}${string}`;
