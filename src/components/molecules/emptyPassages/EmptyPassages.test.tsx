import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TTopic } from "@/types";

import { EmptyPassages } from "./EmptyPassages";

const concepts = [
  { wikibase_id: "Q374", preferred_label: "extreme weather" },
  { wikibase_id: "Q412", preferred_label: "air pollution" },
] as TTopic[];

describe("EmptyPassages", () => {
  it("prompts the user to search when there is no query", () => {
    render(<EmptyPassages concepts={[]} hasQuery={false} onClearClick={vi.fn()} onConceptClick={vi.fn()} />);
    expect(screen.getByText("Search passages")).toBeInTheDocument();
    expect(screen.getByText("Type a search or select from topics that appear in this document.")).toBeInTheDocument();
  });

  it("does not offer to clear the search when there is no query", () => {
    render(<EmptyPassages concepts={[]} hasQuery={false} onClearClick={vi.fn()} onConceptClick={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "clear your search" })).not.toBeInTheDocument();
  });

  it("reports no matches when there is a query", () => {
    render(<EmptyPassages concepts={[]} hasQuery onClearClick={vi.fn()} onConceptClick={vi.fn()} />);
    expect(screen.getByText("No matching passages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "clear your search" })).toBeInTheDocument();
  });

  it("calls onClearClick when clearing the search", async () => {
    const onClearClick = vi.fn();
    render(<EmptyPassages concepts={[]} hasQuery onClearClick={onClearClick} onConceptClick={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "clear your search" }));
    expect(onClearClick).toHaveBeenCalledOnce();
  });

  it("renders a button for every concept", () => {
    render(<EmptyPassages concepts={concepts} hasQuery={false} onClearClick={vi.fn()} onConceptClick={vi.fn()} />);
    expect(screen.getByText("Commonly mentioned in this document")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "extreme weather" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "air pollution" })).toBeInTheDocument();
  });

  it("calls onConceptClick with the concept label", async () => {
    const onConceptClick = vi.fn();
    render(<EmptyPassages concepts={concepts} hasQuery={false} onClearClick={vi.fn()} onConceptClick={onConceptClick} />);
    await userEvent.click(screen.getByRole("button", { name: "air pollution" }));
    expect(onConceptClick).toHaveBeenCalledWith("air pollution");
  });

  it("does not render the concepts section when there are no concepts", () => {
    render(<EmptyPassages concepts={[]} hasQuery={false} onClearClick={vi.fn()} onConceptClick={vi.fn()} />);
    expect(screen.queryByText("Commonly mentioned in this document")).not.toBeInTheDocument();
  });
});
