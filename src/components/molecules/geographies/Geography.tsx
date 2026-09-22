import { kebabCase } from "lodash";
import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { COUNTRY_FLAGS } from "@/constants/flags";
import { GEOGRAPHY_SLUG_CONVERSIONS } from "@/constants/geography";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TNestedSearchLabel } from "@/types";
import { joinNodes } from "@/utils/reactNode";

interface IProps {
  geographyLabel: TNestedSearchLabel;
}

export const Geography = ({ geographyLabel }: IProps) => {
  const features = useContext(FeaturesContext);

  if (!["country", "subdivision"].includes(geographyLabel.type)) return null;

  /* Slug */
  let slug = kebabCase(geographyLabel.value);
  if (slug in GEOGRAPHY_SLUG_CONVERSIONS) slug = GEOGRAPHY_SLUG_CONVERSIONS[slug];

  /* Name */
  const name = geographyLabel.value;

  /* Flag */
  const [, geoCode] = geographyLabel.id.split(ID_SEPARATOR);
  const flag = COUNTRY_FLAGS[geoCode] ?? null;

  const isSubdivision = geographyLabel.type === "subdivision";
  const isInternational = geoCode === "XAB";
  const hasLink = !isInternational && !(isSubdivision && !features.subdivisions);

  if (!hasLink) {
    return <span>{joinNodes([flag, name], <>&nbsp;</>)}</span>;
  }

  return joinNodes(
    [
      flag,
      <PageLink
        key="link"
        href={`/geographies/${slug}`}
        className="text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
      >
        {name}
      </PageLink>,
    ],
    <>&nbsp;</>
  );
};
