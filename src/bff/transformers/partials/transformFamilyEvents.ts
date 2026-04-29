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
import { groupByType } from "@/utils/data-in/groupByType";

const makeActivityStatusEvents = (importId: string, activityStatusLabels: TDataInLabel[]): TFamilyEventPublic[] =>
  activityStatusLabels.map((label) => ({
    date: label.timestamp,
    event_type: label.value.id.split(ID_SEPARATOR)[1],
    import_id: `${importId}_activity_status_${label.timestamp.slice(10)}`,
    metadata: {},
    status: "OK",
    title: label.value.value,
  }));

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

  if (groupedDocumentLabels.activity_status.length > 0) {
    familyEvents.push(...makeActivityStatusEvents(document.id, groupedDocumentLabels.activity_status));
  }

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

      if (groupedDocLabels.activity_status.length > 0) {
        events.push(...makeActivityStatusEvents(doc.id, groupedDocLabels.activity_status));
      }

      return {
        importId: doc.id,
        events,
      };
    })
    .filter((doc) => doc);

  return {
    familyEvents,
    documentEvents,
  };
};

// type MinimalRequiredLitigationEvent = {
//   date: string;
//   event_type: string;
//   import_id: string;
//   metadata: {
//     action_taken: string[];
//     description: string[];
//   };
//   status: "";
//   title: "";
// };
