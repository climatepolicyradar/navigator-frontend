import { kebabCase } from "lodash";
import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { COUNTRY_FLAGS } from "@/constants/flags";
import { GEOGRAPHY_SLUG_CONVERSIONS } from "@/constants/geography";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabel } from "@/types";
import { joinNodes } from "@/utils/reactNode";
import { joinTailwindClasses } from "@/utils/tailwind";

export const labelIsRegion = (label: TLabel) => label.type === "region";

interface IProps {
  geographyLabel: TLabel;
  linkClasses?: string;
  noLink?: boolean;
  showFlag?: boolean;
}

export const Geography = ({ geographyLabel, linkClasses, noLink = false, showFlag = true }: IProps) => {
  const features = useContext(FeaturesContext);

  const isSubdivision = geographyLabel.type === "subdivision";
  const [, geoCode] = geographyLabel.id.split(ID_SEPARATOR);

  /* Slug */
  let slug = isSubdivision ? geoCode.toLowerCase() : kebabCase(geographyLabel.value);
  if (slug in GEOGRAPHY_SLUG_CONVERSIONS) slug = GEOGRAPHY_SLUG_CONVERSIONS[slug];

  /* Name */
  const name = geographyLabel.value;

  /* Flag */
  const flag = (showFlag && COUNTRY_FLAGS[geoCode]) || null;

  const isInternational = geoCode === "XAB";
  const hasLink = !noLink && !labelIsRegion(geographyLabel) && !isInternational && !(isSubdivision && !features.subdivisions);

  if (!hasLink) {
    return <span>{joinNodes([flag, name], <>&nbsp;</>)}</span>;
  }

  const allLinkClasses = joinTailwindClasses(
    "text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand",
    linkClasses
  );

  return joinNodes(
    [
      flag,
      <PageLink key="link" href={`/geographies/${slug}`} className={allLinkClasses}>
        {name}
      </PageLink>,
    ],
    <>&nbsp;</>
  );
};
