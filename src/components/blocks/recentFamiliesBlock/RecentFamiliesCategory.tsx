import sortBy from "lodash/sortBy";
import { LucideChevronDownCircle } from "lucide-react";
import Link from "next/link";
import { useContext, useMemo } from "react";

import { EntityCard, IProps as IEntityCardProps } from "@/components/molecules/entityCard/EntityCard";
import { ARROW_RIGHT } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { GeographiesContext } from "@/context/GeographiesContext";
import { getCategoryName } from "@/helpers/getCategoryName";
import { GeographyTypeV2, GeographyV2, TCategorySummary } from "@/types";
import { pluralise } from "@/utils/pluralise";
import { joinTailwindClasses } from "@/utils/tailwind";
import { formatDate } from "@/utils/timedate";

const MAX_CARDS = 4;

const getMostSpecificGeography = (geographies: GeographyV2[]): GeographyV2 => {
  if (!geographies.length) return null;

  const GEOGRAPHY_TYPE_WEIGHTING: GeographyTypeV2[] = ["subdivision", "country", "region"];
  return sortBy(geographies, (geo) => GEOGRAPHY_TYPE_WEIGHTING.indexOf(geo.type))[0];
};

interface IProps {
  categorySummary: TCategorySummary | null;
  showAccordion?: boolean;
  isExpanded?: boolean;
  onAccordionClick?: () => void;
  geography: GeographyV2;
}

export const RecentFamiliesCategory = ({
  categorySummary: { count, families, singularAndPlural, title, id },
  showAccordion = false,
  isExpanded = true,
  onAccordionClick,
  geography,
}: IProps) => {
  const allGeographies = useContext(GeographiesContext);

  const cards: IEntityCardProps[] = useMemo(
    () =>
      families.slice(0, MAX_CARDS).map((family) => {
        const geographies = family.family_geographies.map((familyGeo) => allGeographies.find((geo) => geo.id === familyGeo)).filter((geo) => geo);

        const metadata = [
          getCategoryName(family.family_category, family.corpus_type_name, family.family_source),
          getMostSpecificGeography(geographies)?.name,
          formatDate(family.family_date)[0],
        ].filter((line) => Boolean(line));

        return {
          href: `/document/${family.family_slug}`,
          title: family.family_name,
          metadata,
        };
      }),
    [allGeographies, families]
  );

  const clickAccordion = () => {
    onAccordionClick?.();
  };

  const accordionIconClasses = joinTailwindClasses("text-text-brand-darker", isExpanded && "rotate-180");

  const viewAllUrlQuery = {
    [QUERY_PARAMS.country]: geography.slug,
  };

  if (title.toLowerCase() !== "all") {
    viewAllUrlQuery[QUERY_PARAMS.category] = id;
  }

  return (
    <div className="border-b border-border-light">
      {/* Accordion */}
      {showAccordion && (
        <div className="pt-5 mb-5">
          <button type="button" onClick={clickAccordion} className="flex items-center gap-3">
            <LucideChevronDownCircle size={20} className={accordionIconClasses} />
            <h3 className="text-lg text-text-primary font-[660] leading-tight">{title}</h3>
          </button>
        </div>
      )}

      {/* Cards */}
      {(!showAccordion || isExpanded) && (
        <>
          {families.length > 0 && (
            <div className="flex gap-5 items-stretch overflow-x-auto pb-2">
              {cards.map((card) => (
                <EntityCard key={card.href} {...card} />
              ))}
              <Link
                href={{
                  pathname: "/search",
                  query: { ...viewAllUrlQuery },
                }}
                className="min-w-16 max-w-25 flex-1 flex justify-center items-center bg-surface-brand-darker/8 text-text-brand-darker font-semibold leading-tight"
              >
                All {ARROW_RIGHT}
              </Link>
            </div>
          )}
          <p className="mt-4 mb-12 text-sm text-text-tertiary">
            There {pluralise(count, ["is", "are"])} {count} {pluralise(count, singularAndPlural)} in the database.
          </p>
        </>
      )}
    </div>
  );
};
