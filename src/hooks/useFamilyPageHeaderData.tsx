import orderBy from "lodash/orderBy";
import { ReactNode, useMemo } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import { GeographyLink, IProps as GeographyLinkProps } from "@/components/molecules/geographyLink/GeographyLink";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

const MAX_SHOWN_GEOGRAPHIES = 3;

interface IProps {
  countries: TGeography[];
  family: TFamilyPublic;
  subdivisions: TGeographySubdivision[];
}

type FamilyPageHeaderData = {
  pageHeaderMetadata: IMetadata[];
  breadcrumbGeography: TBreadcrumbLink | null;
  breadcrumbParentGeography: TBreadcrumbLink | null;
};

export const useFamilyPageHeaderData = ({ countries, family, subdivisions }: IProps): FamilyPageHeaderData =>
  useMemo(() => {
    /* Misc */

    const categoryName = getCategoryName(family.category, family.corpus_type_name, family.organisation);
    const [year] = convertDate(family.published_date);

    /* Geographies data */

    const codeIsCountry = (code: string) => !code.includes("-");

    // TODO use the new geography endpoint + GeographyV2
    const geographiesDisplayData: GeographyLinkProps[] = orderBy(
      family.geographies
        .map((code) => {
          const isSubdivision = !codeIsCountry(code);
          const name = isSubdivision ? getSubdivisionName(code, subdivisions) : getCountryName(code, countries);
          const slug = isSubdivision ? code.toLowerCase() : getCountrySlug(code, countries);
          return name && slug ? { code, name, slug: isSystemGeo(name) ? undefined : slug } : null;
        })
        .filter((data) => data),
      [(data) => data.code.includes("-"), "name"],
      ["asc", "asc"]
    );

    /* Geographies breadcrumbs */

    let breadcrumbGeography: TBreadcrumbLink = null;
    let breadcrumbParentGeography: TBreadcrumbLink = null;

    if (geographiesDisplayData.length > 0) {
      if (geographiesDisplayData.some((geo) => !codeIsCountry(geo.code))) {
        // Includes a subdivision
        const subdivision = geographiesDisplayData.find((geo) => !codeIsCountry(geo.code));
        breadcrumbGeography = { label: subdivision.name, href: `/geographies/${subdivision.slug}` };

        // Get the subdivision's parent country
        const subdivisionData = subdivisions.find((sub) => sub.code === subdivision.code);
        const parentCountryCode = subdivisionData.country_alpha_3;
        if (subdivisionData) {
          const countryName = getCountryName(parentCountryCode, countries);
          const countrySlug = getCountrySlug(parentCountryCode, countries);
          if (countryName && countrySlug && !isSystemGeo(countryName)) {
            breadcrumbParentGeography = { label: countryName, href: `/geographies/${countrySlug}` };
          }
        }
      } else {
        // Countries only
        const country = geographiesDisplayData[0];
        if (!isSystemGeo(country.name)) breadcrumbGeography = { label: country.name, href: `/geographies/${country.slug}` };
      }
    }

    /* Geographies in page header */

    const visibleGeographiesData = geographiesDisplayData.slice(0, MAX_SHOWN_GEOGRAPHIES);
    const hiddenGeographiesCount = Math.max(0, geographiesDisplayData.length - MAX_SHOWN_GEOGRAPHIES);

    const isGeographiesParentAndChild =
      visibleGeographiesData.length === 2 && !visibleGeographiesData[0].code.includes("-") && visibleGeographiesData[1].code.includes("-");

    const onShowMore = () => {
      const metadataBlock = document.getElementById("section-metadata");
      metadataBlock?.scrollIntoView({ behavior: "smooth" });
    };

    const geographiesNode: ReactNode[] = joinNodes(
      visibleGeographiesData.map(({ code, name, slug }) => {
        return <GeographyLink key={code} code={code} name={name} slug={isSystemGeo(name) ? null : slug} />;
      }),
      isGeographiesParentAndChild ? <span className="text-gray-400"> / </span> : <>&ensp;</>
    );

    // Scroll to metadata to show hidden geographies
    if (hiddenGeographiesCount > 0) {
      geographiesNode.push(
        <>
          &ensp;
          <button role="button" className="underline" onClick={onShowMore}>
            +{hiddenGeographiesCount} {pluralise(hiddenGeographiesCount, ["other", "others"])}
          </button>
        </>
      );
    }

    /* Metadata */

    const pageHeaderMetadata: IMetadata[] = [
      {
        label: "Geography",
        value: geographiesNode,
      },
      { label: "Date", value: isNaN(year) ? "" : year },
      {
        label: "Document type",
        value: categoryName,
      },
    ];
    if (family.collections.length) {
      pageHeaderMetadata.push({
        label: "Part of",
        value: joinNodes(
          family.collections.map((collection) => (
            <LinkWithQuery key={collection.import_id} href={`/collections/${collection.slug}`} className="hover:underline">
              {collection.title}
            </LinkWithQuery>
          )),
          ", "
        ),
      });
    }

    return {
      pageHeaderMetadata,
      breadcrumbGeography,
      breadcrumbParentGeography,
    };
  }, [countries, family, subdivisions]);
