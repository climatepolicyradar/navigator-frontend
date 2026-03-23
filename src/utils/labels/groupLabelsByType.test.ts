import { TDataInLabel, TDataInLabelType } from "@/schemas";

import { groupLabelsByType } from "./groupLabelsByType";

const LABELS: TDataInLabel[] = [
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
});
