import { LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";

import { groupByType } from "./groupByType";

const TESTING_LABELS: TDataInLabel[] = [
  {
    type: "status",
    value: {
      labels: [],
      id: "Principal",
      type: "status",
      value: "Principal",
    },
    timestamp: null,
  },
  {
    type: "geography",
    value: {
      labels: [],
      id: "USA",
      type: "agent",
      value: "United States",
    },
    timestamp: null,
  },
  {
    type: "geography",
    value: {
      labels: [],
      id: "US-DC",
      type: "agent",
      value: "District of Columbia",
    },
    timestamp: null,
  },
  {
    type: "UNKNOWN" as TDataInLabelType,
    value: {
      labels: [],
      id: "UNKNOWN",
      type: "UNKNOWN",
      value: "UNKNOWN",
    },
    timestamp: null,
  },
];

// Prevents unwanted Valibot errors when testing the above labels
const LABELS = [
  ...TESTING_LABELS,
  ...MANDATORY_FAMILY_LABEL_TYPES.map(
    (labelType) =>
      ({
        type: labelType,
        value: {
          labels: [],
          documents: [],
          id: labelType,
          type: labelType,
          value: labelType,
        },
        timestamp: null,
      }) as TDataInLabel
  ),
];

describe("groupByType", () => {
  const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(LABELS, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES);

  it("groups single labels", () => {
    expect(groupedLabels).toHaveProperty("status");
    expect(groupedLabels.status).toEqual([LABELS[0]]);
  });

  it("groups multiple labels", () => {
    expect(groupedLabels).toHaveProperty("geography");
    expect(groupedLabels.geography).toEqual([LABELS[1], LABELS[2]]);
  });

  it("creates keys for labels that don't exist", () => {
    expect(groupedLabels).toHaveProperty("entity_type");
    expect(groupedLabels.entity_type).toEqual([]);
  });

  it("ignores labels not explicitly listed", () => {
    expect(groupedLabels).not.toHaveProperty("UNKNOWN");
  });

  it("throws an error when a mandatory label type is not present", () => {
    expect(() => groupByType<TDataInLabel, TDataInLabelType>(TESTING_LABELS, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES)).toThrow(
      /Expected grouped items to have at least 1 item of type '[^']+'/
    );
  });
});
