import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FiltersContext } from "@/context/FiltersContext";
import { TFilterPathLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

import { SearchFilter } from "./SearchFilter";
import { OneLevel, ThreeLevels, TwoLevels } from "./SearchFilter.stories";

const oneLevelLabel = OneLevel.args!.label!;
const twoLevelsLabel = TwoLevels.args!.label!;
const threeLevelsLabel = ThreeLevels.args!.label!;

const parentLabel = twoLevelsLabel;
const childLabel = twoLevelsLabel.children[0];

const renderWithFiltersContext = (
  ancestorPath: TFilterPathLabel[],
  label: typeof oneLevelLabel,
  checkedLabelPaths: TFilterPathLabel[][],
  toggleFilter = vi.fn()
) =>
  render(
    <FiltersContext.Provider value={{ checkedLabelPaths, clearFilters: vi.fn(), labelValues: {}, toggleFilter }}>
      <ul>
        <SearchFilter ancestorPath={ancestorPath} label={label} />
      </ul>
    </FiltersContext.Provider>
  );

const getToggleButton = (name: string) => screen.getByRole("checkbox", { name }).closest("button") as HTMLButtonElement;

describe("SearchFilter", () => {
  it("calls toggleFilter when an unchecked filter is checked", async () => {
    const toggleFilter = vi.fn();

    renderWithFiltersContext([], oneLevelLabel, [], toggleFilter);

    await userEvent.click(screen.getByRole("checkbox", { name: "Filter" }));
    expect(toggleFilter).toHaveBeenCalledWith([getFilterPathLabel(oneLevelLabel)], true);
  });

  it("calls toggleFilter when a checked filter is unchecked", async () => {
    const toggleFilter = vi.fn();
    const path = [getFilterPathLabel(oneLevelLabel)];

    renderWithFiltersContext([], oneLevelLabel, [path], toggleFilter);

    await userEvent.click(screen.getByRole("checkbox", { name: "Filter" }));
    expect(toggleFilter).toHaveBeenCalledWith(path, false);
  });

  it("reveals children when a filter dropdown is expanded", async () => {
    renderWithFiltersContext([], parentLabel, []);

    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
    await userEvent.click(getToggleButton("Parent"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  it("reveals children when an unchecked filter is checked", async () => {
    renderWithFiltersContext([], parentLabel, []);

    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Parent" }));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  it("hides children when a filter dropdown is collapsed", async () => {
    renderWithFiltersContext([], parentLabel, []);

    await userEvent.click(getToggleButton("Parent"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    await userEvent.click(getToggleButton("Parent"));
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
  });

  it("hides children when a checked filter is unchecked and no descendants are checked", async () => {
    const parentPath = [getFilterPathLabel(parentLabel)];

    renderWithFiltersContext([], parentLabel, [parentPath]);

    await userEvent.click(getToggleButton("Parent"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Parent" }));
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
  });

  it("keeps children revealed when a checked filter is unchecked and a child is checked", async () => {
    const parentPath = [getFilterPathLabel(parentLabel)];
    const childPath = [getFilterPathLabel(childLabel), ...parentPath];

    renderWithFiltersContext([], parentLabel, [parentPath, childPath]);

    await userEvent.click(getToggleButton("Parent"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Parent" }));
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  it("keeps children revealed when a checked filter is unchecked and a grandchild is checked", async () => {
    const grandparentLabel = threeLevelsLabel;
    const middleLabel = threeLevelsLabel.children[0];
    const grandchildLabel = middleLabel.children[0];

    const grandparentPath = [getFilterPathLabel(grandparentLabel)];
    const grandchildPath = [getFilterPathLabel(grandchildLabel), getFilterPathLabel(middleLabel), ...grandparentPath];

    renderWithFiltersContext([], grandparentLabel, [grandparentPath, grandchildPath]);

    await userEvent.click(getToggleButton("Grandparent"));
    expect(screen.getByText("Parent A")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Grandparent" }));
    expect(screen.getByText("Parent A")).toBeInTheDocument();
  });
});
