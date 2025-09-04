import sortBy from "lodash/sortBy";
import { useContext } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { GeographiesContext } from "@/context/GeographiesContext";
import { getCategoryName } from "@/helpers/getCategoryName";
import { GeographyTypeV2, GeographyV2, TFamily } from "@/types";
import { formatDate } from "@/utils/timedate";

interface IProps {
  family: TFamily;
}

const getMostSpecificGeography = (geographies: GeographyV2[]): GeographyV2 => {
  if (!geographies.length) return null;

  const GEOGRAPHY_TYPE_WEIGHTING: GeographyTypeV2[] = ["subdivision", "country", "region"];
  return sortBy(geographies, (geo) => GEOGRAPHY_TYPE_WEIGHTING.indexOf(geo.type))[0];
};

export const RecentFamilyCard = ({ family }: IProps) => {
  const allGeographies = useContext(GeographiesContext);
  const geographies = family.family_geographies.map((familyGeo) => allGeographies.find((geo) => geo.id === familyGeo)).filter((geo) => geo);
  const mostSpecificGeography = getMostSpecificGeography(geographies);

  const categoryName = getCategoryName(family.family_category, family.corpus_type_name, family.family_source);
  const [year] = formatDate(family.family_date);

  return (
    <LinkWithQuery href={`/document/${family.family_slug}`} className="w-51 h-65 shrink-0 border-t-2 border-t-surface-brand-darker">
      <div className="flex flex-col justify-between gap-5 h-full p-5 border border-border-light border-t-0">
        <div className=" text-text-brand-darker font-semibold leading-tight line-clamp-7">{family.family_name}</div>
        <ul className="flex flex-col gap-1.5 text-[13px] text-text-tertiary leading-none">
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">{categoryName}</li>
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">{mostSpecificGeography.name}</li>
          {!isNaN(year) && <li className="overflow-hidden whitespace-nowrap text-ellipsis">{year}</li>}
        </ul>
      </div>
    </LinkWithQuery>
  );
};
