import { MANDATORY_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";

import { groupLabelsByType } from "./groupLabelsByType";

const TESTING_LABELS: TDataInLabel[] = [
  {
    type: "status",
    value: {
      labels: [],
      documents: [],
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
      documents: [],
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
      documents: [],
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
      documents: [],
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
  ...MANDATORY_LABEL_TYPES.map(
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

describe("groupLabelsByType", () => {
  const groupedLabels = groupLabelsByType(LABELS);

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
    expect(() => groupLabelsByType(TESTING_LABELS)).toThrow(/Expected document to have at least 1 label of type '[^']+'/);
  });
});
