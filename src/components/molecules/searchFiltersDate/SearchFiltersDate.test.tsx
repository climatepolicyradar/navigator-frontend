import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FiltersContext, TDateRange } from "@/context/FiltersContext";
import { TFiltersGroup } from "@/types";

import { SearchFiltersDate } from "./SearchFiltersDate";

const currentYear = new Date().getFullYear();

const datepickerFilterGroup: TFiltersGroup = {
  title: "Date range",
  container: "datepicker",
  rootLabelTypes: [],
  nestedLabels: [],
};

const popoverFilterGroup: TFiltersGroup = {
  title: "Topics",
  container: "popover",
  rootLabelTypes: [],
  nestedLabels: [],
};

const renderWithFiltersContext = (
  filterGroup: TFiltersGroup,
  { appliedDateRange = null, setDateRange = vi.fn() }: { appliedDateRange?: TDateRange; setDateRange?: (dateRange: TDateRange) => void } = {}
) =>
  render(
    <FiltersContext.Provider
      value={{ appliedDateRange, checkedLabelPaths: [], clearFilters: vi.fn(), labelValues: {}, setDateRange, toggleFilter: vi.fn() }}
    >
      <SearchFiltersDate filterGroup={filterGroup} />
    </FiltersContext.Provider>
  );

const openPopover = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Date range" }));
};

describe("SearchFiltersDate", () => {
  it("renders nothing when the filter group's container is not a datepicker", () => {
    renderWithFiltersContext(popoverFilterGroup);
    expect(screen.queryByRole("button", { name: "Topics" })).not.toBeInTheDocument();
  });

  it("selects 'All time' and disables Apply when no date range is applied", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();

    expect(screen.getByRole("radio", { name: "All time" })).toBeChecked();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("applies 'Last year' as a relative range", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();

    await userEvent.click(screen.getByRole("radio", { name: "Last year" }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(setDateRange).toHaveBeenCalledWith([currentYear - 1, currentYear]);
  });

  it("applies 'Last 5 years' as a relative range", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();

    await userEvent.click(screen.getByRole("radio", { name: "Last 5 years" }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(setDateRange).toHaveBeenCalledWith([currentYear - 5, currentYear]);
  });

  it("deselects the radio option and applies a custom range when years are typed", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "1992");
    await userEvent.type(screen.getByPlaceholderText("eg: 2025"), "2002");

    expect(screen.getByRole("radio", { name: "All time" })).not.toBeChecked();

    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(setDateRange).toHaveBeenCalledWith([1992, 2002]);
  });

  it("pre-selects the matching radio option and disables Apply for an already-applied preset", async () => {
    renderWithFiltersContext(datepickerFilterGroup, { appliedDateRange: [currentYear - 1, currentYear] });
    await openPopover();

    expect(screen.getByRole("radio", { name: "Last year" })).toBeChecked();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("pre-fills the custom inputs for an already-applied non-preset range", async () => {
    renderWithFiltersContext(datepickerFilterGroup, { appliedDateRange: [1992, 2002] });
    await openPopover();

    expect(screen.getByRole("radio", { name: "All time" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Last year" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Last 5 years" })).not.toBeChecked();
    expect(screen.getByPlaceholderText("eg: 1992")).toHaveValue(1992);
    expect(screen.getByPlaceholderText("eg: 2025")).toHaveValue(2002);
  });

  it("discards unapplied edits when the popover is closed and reopened", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "1992");
    await userEvent.keyboard("{Escape}");
    await openPopover();

    expect(screen.getByRole("radio", { name: "All time" })).toBeChecked();
    expect(screen.getByPlaceholderText("eg: 1992")).toHaveValue(null);
  });

  it("disables Apply while custom years are empty or non-numeric", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "1992");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText("eg: 2025"), "2002");
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
  });
});
