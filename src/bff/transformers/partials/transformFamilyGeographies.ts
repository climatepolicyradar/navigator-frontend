import orderBy from "lodash/orderBy";

import { ID_SEPARATOR } from "@/constants/chars";
import { TDataInLabel } from "@/schemas";
import { TFamilyGeography } from "@/types";
import { codeIsCountry, getGeographySlug } from "@/utils/geography";

export const transformFamilyGeographies = (geographyLabels: TDataInLabel[]): TFamilyGeography[] =>
  orderBy(
    geographyLabels.map((label) => {
      const code = label.value.id.split(ID_SEPARATOR)[1];
      const name = label.value.value;
      const slug = getGeographySlug(code, name);

      return { code, name, slug };
    }),
    [(geo) => codeIsCountry(geo.code), "name"],
    ["desc", "asc"]
  );
