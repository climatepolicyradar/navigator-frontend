import partition from "lodash/partition";
import { Fragment, ReactNode, useMemo } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { getSumUSD } from "@/helpers/getSumUSD";
import { useText } from "@/hooks/useText";
import { IMetadata, TFamilyPublic } from "@/types";
import { scrollToBlock } from "@/utils/blocks/scrollToBlock";
import { codeIsCountry } from "@/utils/geography";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

const MAX_SHOWN_GEOGRAPHIES = 3;

type FamilyPageHeaderData = {
  pageHeaderMetadata: IMetadata[];
  breadcrumbGeography: TBreadcrumbLink | null;
  breadcrumbParentGeography: TBreadcrumbLink | null;
};

export const useFamilyPageHeaderData = (family: TFamilyPublic): FamilyPageHeaderData => {
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);

  return useMemo(() => {
    /* Misc */
    const [year] = convertDate(family.published_date);
    const isLitigation = family.attribution.category === "Litigation";
    const isMCF = family.attribution.category === "Multilateral Climate Fund project";
    const { geographies } = family;

    /* Geographies breadcrumbs */

    let breadcrumbGeography: TBreadcrumbLink = null;
    let breadcrumbParentGeography: TBreadcrumbLink = null;

    if (geographies.length > 0) {
      const [countries, subdivisions] = partition(geographies, (geo) => codeIsCountry(geo.code));

      if (subdivisions.length > 0) {
        // Includes a subdivision
        const subdivision = subdivisions[0];
        breadcrumbGeography = { label: subdivision.name, href: `/geographies/${subdivision.slug}` };

        // Currently our families only have one country when a subdivision is present
        const country = countries[0];
        if (country) breadcrumbParentGeography = { label: country.name, href: `/geographies${country.slug}` };
      } else {
        // Countries only
        const country = countries[0];
        if (!isSystemGeo(country.name)) breadcrumbGeography = { label: country.name, href: `/geographies/${country.slug}` };
      }
    }

    /* Geographies in page header */

    const visibleGeographiesData = geographies.slice(0, MAX_SHOWN_GEOGRAPHIES);
    const hiddenGeographiesCount = Math.max(0, geographies.length - MAX_SHOWN_GEOGRAPHIES);

    const isGeographiesParentAndChild =
      visibleGeographiesData.length === 2 && !visibleGeographiesData[0].code.includes("-") && visibleGeographiesData[1].code.includes("-");

    const geographiesNode: ReactNode[] = joinNodes(
      visibleGeographiesData.map(({ code, name, slug }) => {
        return <GeographyLink key={code} code={code} name={name} slug={isSystemGeo(name) ? null : slug} />;
      }),
      isGeographiesParentAndChild ? <span className="text-gray-400"> / </span> : <>&ensp;</>
    );

    // Scroll to metadata to show hidden geographies
    if (hiddenGeographiesCount > 0) {
      geographiesNode.push(
        <Fragment key="others">
          &ensp;
          <button
            role="button"
            className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
            onClick={scrollToBlock("metadata")}
          >
            +{hiddenGeographiesCount} {pluralise(hiddenGeographiesCount, ["other", "others"])}
          </button>
        </Fragment>
      );
    }

    /* Metadata */

    const pageHeaderMetadata: IMetadata[] = [
      {
        label: "Geography",
        value: geographiesNode,
      },
      { label: `${getCategoryText("familyDate")}`, value: isNaN(year) ? "" : year },
      {
        label: getCategoryText("familyType"),
        value: family.attribution.taxonomy,
      },
    ];
    if (family.collections.length) {
      pageHeaderMetadata.push({
        label: "Part of",
        value: isLitigation
          ? // litigation collections links
            joinNodes(
              family.collections.map((collection) => (
                <PageLink key={collection.import_id} keepQuery href={`/collections/${collection.slug}`} className="hover:underline">
                  {collection.title}
                </PageLink>
              )),
              ", "
            )
          : // non-litigation collections scroll to block
            joinNodes(
              family.collections.map((collection) => (
                <button
                  key={collection.import_id}
                  role="button"
                  className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                  onClick={scrollToBlock("collections")}
                >
                  {collection.title}
                </button>
              )),
              ", "
            ),
      });
    }
    if (isMCF) {
      if (family.metadata?.project_value_fund_spend && family.metadata?.project_value_fund_spend[0] !== "0") {
        pageHeaderMetadata.push({
          label: "Fund Spend",
          value: getSumUSD(family.metadata?.project_value_fund_spend),
        });
      }
      if (family.metadata?.project_value_co_financing && family.metadata?.project_value_co_financing[0] !== "0") {
        pageHeaderMetadata.push({
          label: "Co-Financing",
          value: getSumUSD(family.metadata?.project_value_co_financing),
        });
      }
    }

    return {
      pageHeaderMetadata,
      breadcrumbGeography,
      breadcrumbParentGeography,
    };
  }, [family, getCategoryText]);
};
