import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

import { getLabelDisplay } from "./getLabelDisplay";

const createLabel = (overrides: Partial<TNestedSearchLabel> = {}): TNestedSearchLabel => ({
  id: "sector::energy",
  type: "sector",
  value: "energy",
  children: [],
  ...overrides,
});

const createPathLabel = (id: string): TFilterPathLabel => ({
  id,
  type: "test",
  value: "test",
});

describe("getLabelDisplay", () => {
  it("returns the start-cased type and first-cased value when no replacement matches", () => {
    const label = createLabel({ id: "sector::energy", type: "sector", value: "energy" });

    expect(getLabelDisplay(label)).toEqual({ type: "Sector", name: "Energy", subtitle: null });
  });

  it("applies a replacement's type when the id matches, with no parentId restriction", () => {
    const label = createLabel({ id: "un_convention::paris_agreement", type: "convention", value: "paris agreement" });

    expect(getLabelDisplay(label)).toEqual({ type: "UN Convention", name: "Paris agreement", subtitle: null });
  });

  it("matches the id case-insensitively", () => {
    const label = createLabel({ id: "UN_CONVENTION::paris_agreement", type: "convention", value: "paris agreement" });

    expect(getLabelDisplay(label)).toEqual({ type: "UN Convention", name: "Paris agreement", subtitle: null });
  });

  it("applies a replacement that requires a matching parentId", () => {
    const label = createLabel({ id: "topic::adaptation", type: "topic", value: "adaptation" });
    const ancestorPath = [createPathLabel("category::Law")];

    expect(getLabelDisplay(label, ancestorPath)).toEqual({ type: "Response Area", name: "Adaptation", subtitle: null });
  });

  it("only checks the nearest ancestor for a parentId match", () => {
    const label = createLabel({ id: "topic::adaptation", type: "topic", value: "adaptation" });
    const ancestorPath = [createPathLabel("category::Policy"), createPathLabel("category::Law")];

    expect(getLabelDisplay(label, ancestorPath)).toEqual({ type: "Topic", name: "Adaptation", subtitle: null });
  });

  it("does not apply a parentId replacement when there is no ancestor path", () => {
    const label = createLabel({ id: "topic::adaptation", type: "topic", value: "adaptation" });

    expect(getLabelDisplay(label)).toEqual({ type: "Topic", name: "Adaptation", subtitle: null });
  });

  it("includes a replacement's subtitle when defined", () => {
    const label = createLabel({ id: "group::agent::some_fund", type: "agent", value: "some fund" });

    expect(getLabelDisplay(label)).toEqual({ type: "Agent", name: "Climate funds", subtitle: "Funding source of publisher" });
  });

  it("returns a null subtitle when the matched replacement has none", () => {
    const label = createLabel({ id: "category::Law::act", type: "category", value: "act" });

    expect(getLabelDisplay(label)).toEqual({ type: "Category", name: "Laws", subtitle: null });
  });
});
