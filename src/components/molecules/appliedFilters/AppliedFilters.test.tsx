import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FiltersContext } from "@/context/FiltersContext";
import { TFilterPathLabel } from "@/types";

import { AppliedFilters } from "./AppliedFilters";

const topLevelPath: TFilterPathLabel[] = [{ id: "france", type: "country", value: "France" }];
const nestedPath: TFilterPathLabel[] = [
  { id: "paris", type: "city", value: "Paris" },
  { id: "france", type: "country", value: "France" },
];
const countryWithRegionContextPath: TFilterPathLabel[] = [
  { id: "country::gb", type: "country", value: "United Kingdom" },
  { id: "region::europe", type: "region", value: "Europe" },
];
const subdivisionWithRegionContextPath: TFilterPathLabel[] = [
  { id: "subdivision::wales", type: "subdivision", value: "Wales" },
  { id: "country::gb", type: "country", value: "United Kingdom" },
  { id: "region::europe", type: "region", value: "Europe" },
];
const regionOnlyPath: TFilterPathLabel[] = [{ id: "region::europe", type: "region", value: "Europe" }];

const renderWithFiltersContext = (checkedLabelPaths: TFilterPathLabel[][], clearFilters = vi.fn(), toggleFilter = vi.fn()) =>
  render(
    <FiltersContext.Provider value={{ checkedLabelPaths, clearFilters, labelValues: {}, toggleFilter }}>
      <AppliedFilters showClearAll />
    </FiltersContext.Provider>
  );

describe("AppliedFilters", () => {
  it("renders a top-level label", () => {
    renderWithFiltersContext([topLevelPath]);
    expect(screen.getByText("France")).toBeInTheDocument();
  });

  it("renders a nested label", () => {
    renderWithFiltersContext([nestedPath]);
    expect(screen.getByText("France → Paris")).toBeInTheDocument();
  });

  it("hides the region from a checked country's label when the region is just query context", () => {
    renderWithFiltersContext([countryWithRegionContextPath]);
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
    expect(screen.queryByText(/Europe/)).not.toBeInTheDocument();
  });

  it("hides the region from a checked subdivision's label when the region is just query context", () => {
    renderWithFiltersContext([subdivisionWithRegionContextPath]);
    expect(screen.getByText("United Kingdom → Wales")).toBeInTheDocument();
    expect(screen.queryByText(/Europe/)).not.toBeInTheDocument();
  });

  it("still renders a region's own label when the region itself is checked", () => {
    renderWithFiltersContext([regionOnlyPath]);
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("calls toggleFilter when removing an applied filter", async () => {
    const toggleFilter = vi.fn();
    renderWithFiltersContext([topLevelPath], vi.fn(), toggleFilter);
    await userEvent.click(screen.getByRole("button", { name: "Remove France" }));
    expect(toggleFilter).toHaveBeenCalledWith(topLevelPath, false);
  });

  it("calls clearFilters when clicking 'Clear all'", async () => {
    const clearFilters = vi.fn();
    renderWithFiltersContext([topLevelPath], clearFilters);
    await userEvent.click(screen.getByRole("button", { name: "Clear all filters" }));
    expect(clearFilters).toHaveBeenCalledOnce();
  });
});
