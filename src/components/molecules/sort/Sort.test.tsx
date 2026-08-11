import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { TSortOptionConfig } from "@/types";

import { Sort } from "./Sort";

type TSortId = "relevance" | "recent" | "oldest";

const OPTIONS: TSortOptionConfig[] = [
  { paramValue: "relevance", label: "Relevance" },
  { paramValue: "recent", label: "Most recent" },
  { paramValue: "oldest", label: "Oldest" },
];

const renderSort = (props: Partial<React.ComponentProps<typeof Sort>> = {}) => {
  const onChange = vi.fn();
  render(<Sort sortOptions={OPTIONS} value="relevance" onChange={onChange} {...props} />);
  return { onChange };
};

const getTrigger = () => screen.getByRole("combobox");

/*
  Base UI keeps the positioner hidden until it has measured the trigger, so the popup only becomes
  accessible a tick after the click. Wait for that before querying its contents.
*/
const openPopup = async () => {
  await userEvent.click(getTrigger());
  await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());
};

describe("Sort", () => {
  it("renders the trigger", () => {
    renderSort();
    expect(getTrigger()).toBeInTheDocument();
  });

  it("shows the label alone while the default option is selected", () => {
    renderSort();
    expect(getTrigger()).toHaveTextContent("Sort");
    expect(getTrigger()).not.toHaveTextContent("Relevance");
  });

  it("names the selected option once the selection moves off the default", () => {
    renderSort({ value: "oldest" });
    expect(getTrigger()).toHaveTextContent("Sort: Oldest");
  });

  it("uses a custom label", () => {
    renderSort({ label: "Order by", value: "recent" });
    expect(getTrigger()).toHaveTextContent("Order by: Most recent");
  });

  it("shows the label alone when the value matches no option", () => {
    renderSort({ value: "unknown" as TSortId });
    expect(getTrigger()).toHaveTextContent("Sort");
  });

  it("opens the popup and lists every option", async () => {
    renderSort();
    await openPopup();

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Relevance", "Most recent", "Oldest"]);
  });

  it("marks the current value as the selected option", async () => {
    renderSort({ value: "recent" });
    await openPopup();

    expect(screen.getByRole("option", { name: "Most recent" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Relevance" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the id of the chosen option", async () => {
    const { onChange } = renderSort();
    await openPopup();
    await userEvent.click(screen.getByRole("option", { name: "Oldest" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("oldest");
  });

  // Re-picking the current option still reports it, so consumers must expect redundant calls
  it("calls onChange when the already selected option is chosen", async () => {
    const { onChange } = renderSort();
    await openPopup();
    await userEvent.click(screen.getByRole("option", { name: "Relevance" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("relevance");
  });

  it("renders no options when the options list is empty", async () => {
    renderSort({ sortOptions: [] });
    await userEvent.click(getTrigger());

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
