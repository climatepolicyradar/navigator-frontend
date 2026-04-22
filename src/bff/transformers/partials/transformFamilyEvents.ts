import { TDataInLabel, TDataInLabelType } from "@/schemas";
import { TFamilyEventPublic } from "@/types";
import { TItemsByType } from "@/utils/data-in/groupByType";

export const transformFamilyEvents = (groupedLabels: TItemsByType<TDataInLabel, TDataInLabelType>): TFamilyEventPublic[] => {
  const events: TFamilyEventPublic[] = [];

  if (groupedLabels.activity_status.length > 0) {
    events.push(
      ...groupedLabels.activity_status.map((label) => ({
        date: label.timestamp,
        event_type: label.value.id,
        title: label.value.value,
        // Required properties but unused
        import_id: "TODO",
        metadata: {},
        status: "OK",
      }))
    );
  }

  return events;
};
