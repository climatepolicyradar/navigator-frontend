import { ID_SEPARATOR } from "@/constants/chars";
import { LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES, MANDATORY_FILE_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";
import { TAttributionCategory, TFamilyApiNewData, TFamilyEventPublic } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

const makeActivityStatusEvents = (activityStatusLabels: TDataInLabel[]): TFamilyEventPublic[] =>
  activityStatusLabels.map((label) => ({
    date: label.timestamp,
    event_type: label.value.id.split(ID_SEPARATOR)[1],
    import_id: `activity_status_${label.timestamp.slice(10)}`,
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
  const groupedDocumentLabels = groupByType<TDataInLabel, TDataInLabelType>(document.labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);
  const familyEvents: TFamilyEventPublic[] = [];

  if (groupedDocumentLabels.activity_status.length > 0) {
    familyEvents.push(...makeActivityStatusEvents(groupedDocumentLabels.activity_status));
  }

  if (category !== "Litigation") {
    return {
      familyEvents,
      documentEvents: [],
    };
  }

  const documentEvents: TDocumentEvents[] = document.documents
    .filter((file) => file.type === "has_member" && file.value.attributes.status === "published")
    .map((file) => {
      const groupedFileLabels = groupByType<TDataInLabel, TDataInLabelType>(file.value.labels, LABEL_TYPES, MANDATORY_FILE_LABEL_TYPES);
      const events: TFamilyEventPublic[] = [];

      if (groupedFileLabels.activity_status.length > 0) {
        events.push(...makeActivityStatusEvents(groupedFileLabels.activity_status));
      }

      return {
        importId: file.value.id,
        events,
      };
    });

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
