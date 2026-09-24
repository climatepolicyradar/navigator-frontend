import { TDataInLabel } from "@/schemas";
import { TLabel } from "@/types";

export const transformFamilyGeographies = (geographyLabels: TDataInLabel[]): TLabel[] =>
  geographyLabels.filter((relation) => relation.value.type !== "region").map((relation) => relation.value);
