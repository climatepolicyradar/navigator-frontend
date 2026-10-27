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

  it("makes the tab header sticky when sticky is set", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} sticky />);
    expect(screen.getByRole("tablist").parentElement?.parentElement).toHaveClass("sticky");
  });

  it("does not make the tab header sticky by default", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByRole("tablist").parentElement?.parentElement).not.toHaveClass("sticky");
  });

  it("renders a tab's banner when another tab is active", () => {
    const tabs: TTabsTab<TTabId>[] = [baseTabs[0], { ...baseTabs[1], banner: "Search banner" }];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} />);
    expect(screen.getByText("Search banner")).toBeInTheDocument();
  });

  it("does not render a tab's banner when that tab is active", () => {
    const tabs: TTabsTab<TTabId>[] = [baseTabs[0], { ...baseTabs[1], banner: "Search banner" }];
    render(<Tabs tabs={tabs} value="search" onValueChange={() => {}} />);
    expect(screen.queryByText("Search banner")).not.toBeInTheDocument();
  });

  it("makes the banner sticky with the tab header", () => {
    const tabs: TTabsTab<TTabId>[] = [baseTabs[0], { ...baseTabs[1], banner: "Search banner" }];
    render(<Tabs tabs={tabs} value="about" onValueChange={() => {}} sticky />);
    expect(screen.getByText("Search banner").closest(".sticky")).toBe(screen.getByRole("tablist").closest(".sticky"));
    expect(screen.getByText("Search banner").closest(".sticky")).not.toBeNull();
  });

  it("names each tab and its tab set for analytics", () => {
    render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} analytics={{ context: "principal-drawer" }} />);

    expect(screen.getByRole("tab", { name: "Search in documents" })).toHaveAttribute("data-ph-capture-attribute-tab", "search");
    expect(screen.getByRole("tab", { name: "Search in documents" })).toHaveAttribute("data-ph-capture-attribute-tab-context", "principal-drawer");
    expect(screen.getByRole("tab", { name: "About" })).toHaveAttribute("data-ph-capture-attribute-tab", "about");
  });

  it("scrolls back to the top of the page when the tab changes", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { rerender } = render(<Tabs tabs={baseTabs} value="search" onValueChange={() => {}} />);

    rerender(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it("does not scroll on the first render", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    render(<Tabs tabs={baseTabs} value="search" onValueChange={() => {}} />);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("does not scroll when re-rendering on the same tab", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { rerender } = render(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);
    scrollTo.mockClear();

    rerender(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);

    expect(scrollTo).not.toHaveBeenCalled();
  });
  it("scrolls the nearest scrollable ancestor back to the top instead of the page", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const container = document.createElement("div");
    // jsdom reports no layout, so stand in for a container the browser has made scrollable.
    Object.defineProperty(container, "scrollHeight", { value: 500, configurable: true });
    Object.defineProperty(container, "clientHeight", { value: 100, configurable: true });
    container.style.overflowY = "auto";
    const containerScrollTo = vi.fn();
    container.scrollTo = containerScrollTo;
    document.body.appendChild(container);

    const { rerender } = render(<Tabs tabs={baseTabs} value="search" onValueChange={() => {}} />, { container });
    rerender(<Tabs tabs={baseTabs} value="about" onValueChange={() => {}} />);

    expect(containerScrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
