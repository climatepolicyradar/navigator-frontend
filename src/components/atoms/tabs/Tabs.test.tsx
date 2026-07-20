import { render, screen, fireEvent } from "@testing-library/react";

import { Tabs, TTabsTab } from "./Tabs";

type TTabId = "about" | "search";

const baseTabs: TTabsTab<TTabId>[] = [
  { id: "about", label: "About" },
  { id: "search", label: "Search in documents" },
];

describe("Tabs", () => {
  it("renders a tab for each item", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Search in documents" })).toBeInTheDocument();
  });

  it("marks the tab matching value as selected", () => {
    render(<Tabs tabs={baseTabs} value="search" onValueChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Search in documents" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "About" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onValueChange with the id of the clicked tab", () => {
    const handleValueChange = vi.fn();
    render(<Tabs tabs={baseTabs} value="about" onValueChange={handleValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Search in documents" }));
    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("search");
  });

  it("renders a count badge when count is provided", () => {
    const tabs: TTabsTab<TTabId>[] = [baseTabs[0], { ...baseTabs[1], count: 23 }];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByText("23")).toBeInTheDocument();
  });

  it("does not render a count badge when count is absent", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("renders a count badge of zero", () => {
    const tabs: TTabsTab<TTabId>[] = [baseTabs[0], { ...baseTabs[1], count: 0 }];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders the panel content for the active tab", () => {
    const tabs: TTabsTab<TTabId>[] = [
      { ...baseTabs[0], panel: "About panel content" },
      { ...baseTabs[1], panel: "Search panel content" },
    ];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByText("About panel content")).toBeInTheDocument();
  });

  it("does not render panel content for an inactive tab", () => {
    const tabs: TTabsTab<TTabId>[] = [
      { ...baseTabs[0], panel: "About panel content" },
      { ...baseTabs[1], panel: "Search panel content" },
    ];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} />);
    expect(screen.queryByText("Search panel content")).not.toBeInTheDocument();
  });

  it("does not render a panel for a tab with no panel content", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });
});
