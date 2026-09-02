import { TFiltersGroupConfig, TNestedSearchLabel } from "@/types";

import { groupSearchLabels } from "./groupSearchLabels";

const label = (type: string, value: string): TNestedSearchLabel => ({
  id: `${type}::${value}`,
  type,
  value,
  children: [],
});

const popoverGroup = (overrides: Partial<TFiltersGroupConfig> = {}): TFiltersGroupConfig =>
  ({
    title: "Topic",
    container: "popover",
    rootLabelTypes: ["concept"],
    ...overrides,
  }) as TFiltersGroupConfig;

describe("groupSearchLabels", () => {
  it("returns a group with the labels matching its root label types", () => {
    const concept = label("concept", "adaptation");
    const grouped = groupSearchLabels([concept, label("region", "europe")], [popoverGroup()]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0].nestedLabels).toEqual([concept]);
  });

  it("drops a group with no matching labels", () => {
    const grouped = groupSearchLabels([label("region", "europe")], [popoverGroup()]);

    expect(grouped).toEqual([]);
  });

  it("keeps a group with no matching labels when renderWhenEmpty is set", () => {
    const grouped = groupSearchLabels([label("region", "europe")], [popoverGroup({ renderWhenEmpty: true })]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0].nestedLabels).toEqual([]);
  });

  it("still runs prepareRootLabels for a group kept by renderWhenEmpty", () => {
    const placeholder = label("concept", "placeholder");
    const prepareRootLabels = vi.fn(() => [placeholder]);
    const grouped = groupSearchLabels([], [popoverGroup({ renderWhenEmpty: true, prepareRootLabels })]);

    expect(prepareRootLabels).toHaveBeenCalledWith([]);
    expect(grouped[0].nestedLabels).toEqual([placeholder]);
  });
});
