import { Fragment } from "react";

import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { EN_DASH } from "@/constants/chars";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { IMetadata, TFamilyPublic, TGeography } from "@/types";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { convertDate } from "@/utils/timedate";

export function getUNFCCCMetadata(family: TFamilyPublic, countries: TGeography[]): IMetadata[] {
  const metadata = [];

  const [year] = convertDate(family.published_date);
  const document_type = family.documents && family.documents.length > 0 ? family.documents[0].document_type : null;

  /* Year */
  metadata.push({
    label: "Year",
    value: year || EN_DASH,
  });

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => {
        const geoSlug = getCountrySlug(geo, countries);
        const geoName = getCountryName(geo, countries);
        return (
          <Fragment key={geo}>
            {index > 0 && ", "}
            {!isSystemGeo(geoName) ? <GeographyLink code={geo} name={geoName} slug={geoSlug || geo.toLowerCase()} /> : <span>{geoName}</span>}
          </Fragment>
        );
      }),
    });
  }

  /* Document Type */
  metadata.push({
    label: "Type",
    value: document_type || EN_DASH,
  });

  family?.metadata?.author_type &&
    metadata.push({
      label: "Author Type",
      value: family.metadata?.author_type.join(", ") || EN_DASH,
    });

  family?.metadata?.author &&
    metadata.push({
      label: "Author",
      value: family.metadata?.author.join(", ") || EN_DASH,
    });

  return metadata;
}
