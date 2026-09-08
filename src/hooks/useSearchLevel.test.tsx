import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

import { TSearchQueryGroup } from "@/types";
import { seedPassageLevel } from "@/utils/search/searchLevels";

import { useNestedSearchLevel, useSearchLevelValues } from "./useSearchLevel";

const conceptRule = { field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true } as const;
const countryRule = { field: "labels.value.id", op: "contains", value: "country::LVA", checked: true } as const;
const baseFilters: TSearchQueryGroup = { op: "and", filters: [conceptRule, countryRule] };

/*
  Stands in for the two places a nested level is opened: the results page, whose sort orders
  documents and so does not carry over, and a passage search opening one of its own documents.
*/
const Harness = () => {
  const [baseSearch] = useSearchLevelValues("base");
  const principalLevel = useNestedSearchLevel("principal");

  return (
    <>
      <button onClick={() => principalLevel.open("CCLW.family.1.0", seedPassageLevel({ query: baseSearch.query, filters: baseSearch.filters }))}>
        open from the results
      </button>
      <button onClick={() => principalLevel.open("CCLW.family.1.0", seedPassageLevel(baseSearch))}>open from a passage search</button>
      <button onClick={principalLevel.close}>close</button>
      <p>showing: {principalLevel.id ?? "nothing"}</p>
    </>
  );
};

const renderHarness = (searchParams: Record<string, string>) => {
  const onUrlUpdate = vi.fn();
  render(<Harness />, { wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate, hasMemory: true }) });
  return onUrlUpdate;
};

const click = (name: string) => userEvent.click(screen.getByRole("button", { name }));

describe("useNestedSearchLevel", () => {
  it("opens the level with what carries over, in a single push", async () => {
    const onUrlUpdate = renderHarness({ q: "flood risk", filters: JSON.stringify(baseFilters), sort: "recent" });

    await click("open from the results");

    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    const { options, searchParams } = onUrlUpdate.mock.calls[0][0];
    expect(options.history).toBe("push");
    expect(searchParams.get("principal")).toBe("CCLW.family.1.0");
    expect(searchParams.get("principal_q")).toBe("flood risk");
    expect(JSON.parse(searchParams.get("principal_filters") ?? "null")).toEqual({ op: "and", filters: [conceptRule] });
    expect(await screen.findByText("showing: CCLW.family.1.0")).toBeInTheDocument();
  });

  it("leaves the search on the page below untouched", async () => {
    const onUrlUpdate = renderHarness({ q: "flood risk", filters: JSON.stringify(baseFilters), sort: "recent" });

    await click("open from the results");

    const { searchParams } = onUrlUpdate.mock.calls[0][0];
    expect(searchParams.get("q")).toBe("flood risk");
    expect(JSON.parse(searchParams.get("filters") ?? "null")).toEqual(baseFilters);
    expect(searchParams.get("sort")).toBe("recent");
  });

  it("does not carry a document ordering into a passage search", async () => {
    const onUrlUpdate = renderHarness({ sort: "recent" });

    await click("open from the results");

    expect(onUrlUpdate.mock.calls[0][0].searchParams.get("principal_sort")).toBeNull();
  });

  it("carries the ordering between two passage searches", async () => {
    const onUrlUpdate = renderHarness({ sort: "idx asc" });

    await click("open from a passage search");

    expect(onUrlUpdate.mock.calls[0][0].searchParams.get("principal_sort")).toBe("idx asc");
  });

  it("closes by removing every param of the level, restoring the page below", async () => {
    const onUrlUpdate = renderHarness({
      q: "flood risk",
      filters: JSON.stringify(baseFilters),
      principal: "CCLW.family.1.0",
      principal_q: "levees",
      principal_filters: JSON.stringify({ op: "and", filters: [conceptRule] }),
      principal_docs: "CCLW.document.1.2",
      principal_sort: "idx asc",
    });

    await click("close");

    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    const { options, searchParams } = onUrlUpdate.mock.calls[0][0];
    expect(options.history).toBe("replace");
    expect([...searchParams.keys()].filter((key) => key.startsWith("principal"))).toEqual([]);
    expect(searchParams.get("q")).toBe("flood risk");
    expect(JSON.parse(searchParams.get("filters") ?? "null")).toEqual(baseFilters);
    expect(await screen.findByText("showing: nothing")).toBeInTheDocument();
  });
});
