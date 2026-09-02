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

const openCustomSection = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Custom" }));
};

describe("SearchFiltersDate", () => {
  it("renders nothing when the filter group's container is not a datepicker", () => {
    renderWithFiltersContext(popoverFilterGroup);
    expect(screen.queryByRole("button", { name: "Topics" })).not.toBeInTheDocument();
  });

  it("selects 'All time' by default and keeps the Custom section collapsed", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();

    expect(screen.getByRole("radio", { name: "All time" })).toBeChecked();
    expect(screen.queryByPlaceholderText("eg: 1992")).not.toBeInTheDocument();
  });

  it("applies 'Last year' immediately and closes the popover", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();

    await userEvent.click(screen.getByRole("radio", { name: "Last year" }));

    expect(setDateRange).toHaveBeenCalledWith([currentYear - 1, currentYear]);
    expect(screen.queryByRole("radio", { name: "Last year" })).not.toBeInTheDocument();
  });

  it("applies 'Last 5 years' immediately and closes the popover", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();

    await userEvent.click(screen.getByRole("radio", { name: "Last 5 years" }));

    expect(setDateRange).toHaveBeenCalledWith([currentYear - 5, currentYear]);
    expect(screen.queryByRole("radio", { name: "Last 5 years" })).not.toBeInTheDocument();
  });

  it("applies a custom range when valid years are entered and Apply is clicked", async () => {
    const setDateRange = vi.fn();
    renderWithFiltersContext(datepickerFilterGroup, { setDateRange });
    await openPopover();
    await openCustomSection();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "1992");
    await userEvent.type(screen.getByPlaceholderText("eg: 2025"), "2002");
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(setDateRange).toHaveBeenCalledWith([1992, 2002]);
  });

  it("disables Apply until both custom years are valid four-digit numbers", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();
    await openCustomSection();

    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "199");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "2");
    await userEvent.type(screen.getByPlaceholderText("eg: 2025"), "2002");
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
  });

  it("pre-selects the matching radio option for an already-applied preset", async () => {
    renderWithFiltersContext(datepickerFilterGroup, { appliedDateRange: [currentYear - 1, currentYear] });
    await openPopover();

    expect(screen.getByRole("radio", { name: "Last year" })).toBeChecked();
    expect(screen.queryByPlaceholderText("eg: 1992")).not.toBeInTheDocument();
  });

  it("opens the Custom section and pre-fills inputs for an already-applied non-preset range", async () => {
    renderWithFiltersContext(datepickerFilterGroup, { appliedDateRange: [1992, 2002] });
    await openPopover();

    expect(screen.getByPlaceholderText("eg: 1992")).toHaveValue(1992);
    expect(screen.getByPlaceholderText("eg: 2025")).toHaveValue(2002);
    expect(screen.queryByRole("radio", { name: "All time" })).not.toBeInTheDocument();
  });

  it("shows no radio selected when a custom range is applied and the Date range section is expanded", async () => {
    renderWithFiltersContext(datepickerFilterGroup, { appliedDateRange: [1992, 2002] });
    await openPopover();

    const [, dateRangeSectionTrigger] = screen.getAllByRole("button", { name: "Date range" });
    await userEvent.click(dateRangeSectionTrigger);

    expect(screen.getByRole("radio", { name: "All time" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Last year" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Last 5 years" })).not.toBeChecked();
  });

  it("discards unapplied custom edits when the popover is closed and reopened", async () => {
    renderWithFiltersContext(datepickerFilterGroup);
    await openPopover();
    await openCustomSection();

    await userEvent.type(screen.getByPlaceholderText("eg: 1992"), "1992");
    await userEvent.keyboard("{Escape}");
    await openPopover();
    await openCustomSection();

    expect(screen.getByPlaceholderText("eg: 1992")).toHaveValue(null);

    const [, dateRangeSectionTrigger] = screen.getAllByRole("button", { name: "Date range" });
    await userEvent.click(dateRangeSectionTrigger);
    expect(screen.getByRole("radio", { name: "All time" })).toBeChecked();
  });
});
