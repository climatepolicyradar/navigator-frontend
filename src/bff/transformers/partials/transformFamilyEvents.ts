import { getChildDocuments } from "@/bff/methods/getRelations";
import { ID_SEPARATOR } from "@/constants/chars";
import {
  LABEL_TYPES,
  MANDATORY_FAMILY_LABEL_TYPES,
  MANDATORY_DOCUMENT_LABEL_TYPES,
  TDataInLabel,
  TDataInLabelType,
  validateDocumentAttributes,
} from "@/schemas";
import { TAttributionCategory, TFamilyApiNewData, TFamilyEventPublic } from "@/types";
import { groupByType, TItemsByType } from "@/utils/data-in/groupByType";

const makeActivityStatusEvent = (groupedLabels: TItemsByType<TDataInLabel, TDataInLabelType>): TFamilyEventPublic | null => {
  const activityStatusLabel = groupedLabels.activity_status[0];
  if (!activityStatusLabel) return null;

  const eventType = groupedLabels.entity_type[0]?.value.value ?? activityStatusLabel.value.id.split(ID_SEPARATOR)[1];

  return {
    date: activityStatusLabel.timestamp,
    event_type: eventType,
    import_id: "event_" + Math.random().toString().replace(".", ""), // Only needs to be unique
    metadata: {},
    status: "OK",
    title: eventType,
  };
};

export type TDocumentEvents = {
  importId: string;
  events: TFamilyEventPublic[];
};

type TAllFamilyEvents = {
  familyEvents: TFamilyEventPublic[];
  documentEvents: TDocumentEvents[];
};

export const transformFamilyEvents = (document: TFamilyApiNewData, category: TAttributionCategory): TAllFamilyEvents => {
  const groupedDocumentLabels = groupByType<TDataInLabel, TDataInLabelType>(document.labels, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES);
  const familyEvents: TFamilyEventPublic[] = [];

  const familyActivityStatusEvent = makeActivityStatusEvent(groupedDocumentLabels);
  if (familyActivityStatusEvent) familyEvents.push(familyActivityStatusEvent);

  if (category !== "Litigation") {
    return {
      familyEvents,
      documentEvents: [],
    };
  }

  const documentEvents: TDocumentEvents[] = getChildDocuments(document.documents, category)
    .map(({ value: doc }) => {
      const docAttributes = validateDocumentAttributes(doc.attributes);
      if (docAttributes.status !== "published") return null;

      const groupedDocLabels = groupByType<TDataInLabel, TDataInLabelType>(doc.labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);
      const events: TFamilyEventPublic[] = [];

      const documentActivityStatusEvent = makeActivityStatusEvent(groupedDocLabels);
      if (documentActivityStatusEvent) events.push(documentActivityStatusEvent);

      return {
        importId: doc.id,
        events,
      };
    })
    .filter((doc) => doc);

  return {
    familyEvents: [
      ...familyEvents,
      ...documentEvents.map((doc) => doc.events).flat(), // All document events need to be included in family events
    ],
    documentEvents,
  };
};
