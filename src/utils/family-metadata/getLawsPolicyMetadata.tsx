import orderBy from "lodash/orderBy";
import { Fragment } from "react";

import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { EN_DASH } from "@/constants/chars";
import { months } from "@/constants/timedate";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { IFamilyDocumentTopics, IMetadata, TFamilyPublic, TGeography } from "@/types";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { convertDate, formatDate, padNumber } from "@/utils/timedate";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

export function getLawsPolicyMetadata(family: TFamilyPublic, familyTopics: IFamilyDocumentTopics | null, countries: TGeography[]): IMetadata[] {
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

  /* Metadata */
  family.metadata?.topic?.length &&
    metadata.push({
      label: "Response areas",
      value: family.metadata.topic.join(", "),
    });
  family.metadata?.sector?.length &&
    metadata.push({
      label: "Sectors",
      value: family.metadata.sector.join(", "),
    });

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  /* Last amended */
  if (family.events.length > 0) {
    const latestEvent = orderBy(family.events, ["date"], ["desc"])[0];
    // TODO refactor all dates displayed into a single component
    const [year, day, month] = formatDate(latestEvent.date);
    if (year) {
      const monthDisplay = padNumber(months.indexOf(month) + 1);
      metadata.push({
        label: "Last amended",
        value: `${day}/${monthDisplay}/${year}`,
      });
    }
  }

  return metadata;
}
