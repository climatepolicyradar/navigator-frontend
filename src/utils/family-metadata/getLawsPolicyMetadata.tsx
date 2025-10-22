import sortBy from "lodash/sortBy";
import { Fragment } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { convertDate } from "@/utils/timedate";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

export function getLawsPolicyMetadata(family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] {
  const metadata = [];

  const geosOrdered = sortBy(family.geographies, [(geo) => geo.length !== 3, (geo) => geo.toLowerCase()]);
  const [year] = convertDate(family.published_date);
  const document_type = family.documents && family.documents.length > 0 ? family.documents[0].document_type : undefined;

  /* Year */
  metadata.push({
    label: "Year",
    value: year || EN_DASH,
  });

  /* Document Type */
  metadata.push({
    label: "Type",
    value: document_type || EN_DASH,
  });

  /* Geography */
  if (geosOrdered.length > 0) {
    metadata.push({
      label: "Geography",
      value: geosOrdered.map((geo, index) => {
        const geoSlug = getCountrySlug(geo, countries);
        const geoName = geoSlug ? getCountryName(geo, countries) : getSubdivisionName(geo, subdivisions);
        return (
          <Fragment key={geo}>
            {!isSystemGeo(geoName) ? (
              <LinkWithQuery href={`/geographies/${geoSlug || geo.toLowerCase()}`} className="underline">
                {geoName}
              </LinkWithQuery>
            ) : (
              <span>{geoName}</span>
            )}
            {index + 1 < geosOrdered.length && hierarchyArrow}
          </Fragment>
        );
      }),
    });
  }

  /* Metadata */
  family.metadata?.topic?.length > 0 &&
    metadata.push({
      label: "Topics",
      value: family.metadata.topic.join(", "),
    });
  family.metadata?.sector?.length > 0 &&
    metadata.push({
      label: "Sectors",
      value: family.metadata.sector.join(", "),
    });
  family.metadata?.keyword?.length > 0 &&
    metadata.push({
      label: "Keywords",
      value: family.metadata.keyword.join(", "),
    });

  return metadata;
}
