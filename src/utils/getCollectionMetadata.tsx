import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { IMetadata, TCollectionPublicWithFamilies } from "@/types";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

export const getCollectionMetadata = (collection: TCollectionPublicWithFamilies): IMetadata[] => {
  const collectionMetadata: IMetadata[] = [];

  // Get all events from all families in the collection
  const allEvents = collection.families.flatMap((family) => family.events);

  const filingDates = allEvents
    // TODO: confirm if events must be of type "Filing Year For Action" or "Filing Date"
    // .filter((event) => event.event_type === "Filing Year For Action" || event.event_type === "Filing Date")
    .map((event) => new Date(event.date));

  if (filingDates.length > 0) {
    const earliestFilingDate = new Date(Math.min(...filingDates.map((date) => date.getTime())));
    collectionMetadata.push({
      label: "Filing date",
      value: earliestFilingDate ? earliestFilingDate.getFullYear() : EN_DASH,
    });
  }

  collectionMetadata.push({
    label: "Status",
    value: collection.families[0]?.metadata?.status || EN_DASH,
  });

  collectionMetadata.push({
    label: "At issue",
    value: collection.description,
  });

  return collectionMetadata;
};
