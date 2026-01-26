import { ConceptHierarchy } from "@/components/molecules/conceptHierarchy/ConceptHierarchy";
import { EN_DASH } from "@/constants/chars";
import { IMetadata, TCollectionPublicWithFamilies } from "@/types";
import { buildConceptHierarchy } from "@/utils/buildConceptHierarchy";

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
      value: earliestFilingDate && !isNaN(earliestFilingDate.getUTCFullYear()) ? earliestFilingDate.getUTCFullYear() : EN_DASH,
    });
  } else {
    collectionMetadata.push({
      label: "Filing date",
      value: EN_DASH,
    });
  }

  collectionMetadata.push({
    label: "Status",
    value: collection.families[0]?.metadata?.status?.join(", ") || EN_DASH,
  });

  collectionMetadata.push({
    label: "At issue",
    value: collection.description,
  });

  // Each family within the collection shares the same case categories and principal laws
  const hierarchy = buildConceptHierarchy(collection.families[0]?.concepts) || [];

  const caseCategories = hierarchy?.filter((concept) => concept.type === "legal_category");
  collectionMetadata.push({
    label: "Case category",
    value: (
      <div className="grid">
        {caseCategories.length > 0 ? caseCategories.map((category) => <ConceptHierarchy key={category.id} concept={category} />) : EN_DASH}
      </div>
    ),
  });
  const principalLaws = hierarchy.filter((concept) => concept.type === "law");
  collectionMetadata.push({
    label: "Principal law",
    value: (
      <div className="grid">{principalLaws.length > 0 ? principalLaws.map((law) => <ConceptHierarchy key={law.id} concept={law} />) : EN_DASH}</div>
    ),
  });

  return collectionMetadata;
};
