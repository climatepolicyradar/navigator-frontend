import sortBy from "lodash/sortBy";
import { LucideChevronDownCircle } from "lucide-react";
import { ReactNode, useContext, useMemo } from "react";

import { getTaxonomyFromV1 } from "@/bff/methods/getTaxonomy";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { EntityCard, IProps as IEntityCardProps } from "@/components/molecules/entityCard/EntityCard";
import { ARROW_RIGHT } from "@/constants/chars";
import { FeaturesContext } from "@/context/FeaturesContext";
import { GeographiesContext } from "@/context/GeographiesContext";
import { ThemeContext } from "@/context/ThemeContext";
import { GeographyTypeV2, GeographyV2, TCategorySummary, TSearchLabel } from "@/types";
import { getGeoSearchLink } from "@/utils/links/getGeoSearchLink";
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
  geographyLabel: TSearchLabel | null;
}

export const RecentFamiliesCategory = ({
  categorySummary: { count, families, singularAndPlural, title, id },
  showAccordion = false,
  isExpanded = true,
  onAccordionClick,
  geography,
  geographyLabel,
}: IProps) => {
  const allGeographies = useContext(GeographiesContext);
  const { theme, themeConfig } = useContext(ThemeContext);
  const features = useContext(FeaturesContext);

  const cards: IEntityCardProps[] = useMemo(
    () =>
      families.slice(0, MAX_CARDS).map((family) => {
        const geographies = family.family_geographies.map((familyGeo) => allGeographies.find((geo) => geo.id === familyGeo)).filter((geo) => geo);

        const metadata = [
          getTaxonomyFromV1(family.family_category, family.corpus_type_name, family.family_source, family.corpus_import_id),
          getMostSpecificGeography(geographies)?.name,
          formatDate(family.family_date)[0].toString(),
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

  const accordionIconClasses = joinTailwindClasses("text-[#002ca3]", isExpanded && "rotate-180");

  const viewAllProps = getGeoSearchLink({ categoryId: id, features, geography, geographyLabel, themeConfig });

  // Provides a way to set a redirection note to data in one of our other apps
  let placeholder: ReactNode = null;
  if (id === "Litigation" && theme !== "ccc") {
    placeholder = (
      <p className="mt-4 mb-12 text-text-primary">
        Visit the{" "}
        <PageLink external href="https://www.climatecasechart.com/" className="text-[#0038a9] underline">
          Climate Litigation Database
        </PageLink>{" "}
        to see litigation documents.
      </p>
    );
  }

  return (
    <div className="border-b border-border-light">
      {/* Accordion */}
      {showAccordion && (
        <div className="pt-5 mb-5">
          <button
            type="button"
            onClick={clickAccordion}
            className="flex items-center gap-3"
            data-ph-capture-attribute-button-purpose="toggle-accordion"
            data-ph-capture-attribute-accordion-already-open={isExpanded}
            data-ph-capture-attribute-category={id}
          >
            <LucideChevronDownCircle size={20} className={accordionIconClasses} />
            <h3 className="text-lg text-text-primary font-[660] leading-tight">{title}</h3>
          </button>
        </div>
      )}

      {/* Cards */}
      {(!showAccordion || isExpanded) && (
        <>
          {placeholder}
          {!placeholder && (
            <>
              {families.length > 0 && (
                <div className="flex gap-5 items-stretch overflow-x-auto pb-2">
                  {cards.map((card) => (
                    <EntityCard key={card.href} {...card} />
                  ))}
                  <PageLink
                    {...viewAllProps}
                    className="min-w-16 max-w-25 flex-1 flex justify-center items-center bg-[#002ca3]/8 text-[#002ca3] font-semibold leading-tight"
                    data-ph-capture-attribute-link-purpose="all-recents"
                    data-ph-capture-attribute-category={id}
                  >
                    All {ARROW_RIGHT}
                  </PageLink>
                </div>
              )}
              <p className="mt-4 mb-12 text-sm text-text-tertiary">
                There {pluralise(count, ["is", "are"])} {count} {pluralise(count, singularAndPlural)} in the database.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};
