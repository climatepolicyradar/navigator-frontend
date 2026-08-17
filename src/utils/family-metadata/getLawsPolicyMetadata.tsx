import orderBy from "lodash/orderBy";
import { Fragment } from "react";

import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { EN_DASH } from "@/constants/chars";
import { months } from "@/constants/timedate";
import { IFamilyDocumentTopics, IMetadata, TFamilyPublic } from "@/types";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { convertDate, formatDate, padNumber } from "@/utils/timedate";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

export function getLawsPolicyMetadata(family: TFamilyPublic, familyTopics: IFamilyDocumentTopics | null): IMetadata[] {
  const metadata = [];

  const [year] = convertDate(family.published_date);

  /* Year */
  metadata.push({
    label: "Year",
    value: year || EN_DASH,
  });

  /* Most recent update */
  if (family.events.length > 0) {
    const latestEvent = orderBy(family.events, ["date"], ["desc"])[0];
    // TODO refactor all dates displayed into a single component
    const [year, day, month] = formatDate(latestEvent.date);
    if (year) {
      const monthDisplay = padNumber(months.indexOf(month) + 1);
      metadata.push({
        label: "Most recent update",
        value: `${day}/${monthDisplay}/${year}`,
      });
    }
  }

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => {
        return (
          <Fragment key={geo.slug}>
            {index > 0 && ", "}
            {!isSystemGeo(geo.name) ? <GeographyLink {...geo} /> : <span>{geo.name}</span>}
          </Fragment>
        );
      }),
    });
  }

  /* Metadata */
  if (family.metadata?.topic?.length) {
    metadata.push({
      label: "Response areas",
      value: family.metadata.topic.join(", "),
    });
  }
  if (family.metadata?.sector?.length) {
    metadata.push({
      label: "Sectors",
      value: family.metadata.sector.join(", "),
    });
  }

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  return metadata;
}
