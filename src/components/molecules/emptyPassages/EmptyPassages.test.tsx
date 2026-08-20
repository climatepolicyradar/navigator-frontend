import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyPassages } from "./EmptyPassages";

describe("EmptyPassages", () => {
  it("prompts the user to search when there is no query", () => {
    render(<EmptyPassages hasQuery={false} onClearClick={vi.fn()} />);
    expect(screen.getByText("Search passages")).toBeInTheDocument();
    expect(screen.getByText("Type a search or select from topics that appear in this document.")).toBeInTheDocument();
  });

  it("names the subject it is searching", () => {
    render(<EmptyPassages hasQuery={false} onClearClick={vi.fn()} subject="these documents" />);
    expect(screen.getByText("Type a search or select from topics that appear in these documents.")).toBeInTheDocument();
  });

  it("does not offer to clear the search when there is no query", () => {
    render(<EmptyPassages hasQuery={false} onClearClick={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "clear your search" })).not.toBeInTheDocument();
  });

  it("reports no matches when there is a query", () => {
    render(<EmptyPassages hasQuery onClearClick={vi.fn()} />);
    expect(screen.getByText("No matching passages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "clear your search" })).toBeInTheDocument();
  });

  it("calls onClearClick when clearing the search", async () => {
    const onClearClick = vi.fn();
    render(<EmptyPassages hasQuery onClearClick={onClearClick} />);
    await userEvent.click(screen.getByRole("button", { name: "clear your search" }));
    expect(onClearClick).toHaveBeenCalledOnce();
  });
});
