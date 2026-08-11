import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFilterLookup } from "./SearchFilterLookup";

const renderAndSearch = async (labels: TNestedSearchLabel[], searchText: string) => {
  render(
    <FiltersContext.Provider value={{ checkedLabelPaths: [], clearFilters: vi.fn(), labelValues: {}, toggleFilter: vi.fn() }}>
      <SearchFilterLookup ancestorPath={[]} labels={labels} level={1} />
    </FiltersContext.Provider>
  );

  await userEvent.type(screen.getByRole("textbox"), searchText);
};

describe("SearchFilterLookup", () => {
  it("shows a direct child that matches the search term", async () => {
    const labels: TNestedSearchLabel[] = [{ id: "match", type: "author", value: "electric vehicles", children: [] }];

    await renderAndSearch(labels, "electric vehicles");

    expect(screen.getByText("Electric vehicles")).toBeInTheDocument();
  });

  it("does not show a direct child that does not match the search term", async () => {
    const labels: TNestedSearchLabel[] = [{ id: "no-match", type: "author", value: "Solar Panel", children: [] }];

    await renderAndSearch(labels, "electric vehicles");

    expect(screen.queryByText("Solar Panel")).not.toBeInTheDocument();
  });

  it("shows a grandchild that matches the search term", async () => {
    const labels: TNestedSearchLabel[] = [
      {
        id: "parent",
        type: "author",
        value: "Parent Node",
        children: [{ id: "grandchild", type: "author", value: "electric vehicles", children: [] }],
      },
    ];

    await renderAndSearch(labels, "electric vehicles");

    expect(screen.getByText("Electric vehicles")).toBeInTheDocument();
  });

  it("shows a child whose deeper descendant matches the search term", async () => {
    const labels: TNestedSearchLabel[] = [
      {
        id: "parent",
        type: "author",
        value: "Parent Node",
        children: [{ id: "grandchild", type: "author", value: "electric vehicles", children: [] }],
      },
    ];

    await renderAndSearch(labels, "electric vehicles");

    expect(screen.getByText("Parent Node")).toBeInTheDocument();
  });
});
