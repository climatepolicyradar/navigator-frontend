import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ZeroStatePassages } from "./ZeroStatePassages";

describe("ZeroStatePassages", () => {
  it("prompts the user to search when there is no query", () => {
    render(<ZeroStatePassages hasQuery={false} onClearSearch={vi.fn()} />);
    expect(screen.getByText("Search passages")).toBeInTheDocument();
    expect(screen.getByText("Type a search or select from topics that appear in this document.")).toBeInTheDocument();
  });

  it("names the subject it is searching", () => {
    render(<ZeroStatePassages hasQuery={false} onClearSearch={vi.fn()} subject="these documents" />);
    expect(screen.getByText("Type a search or select from topics that appear in these documents.")).toBeInTheDocument();
  });

  it("does not offer to clear the search when there is no query", () => {
    render(<ZeroStatePassages hasQuery={false} onClearSearch={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "clear your search" })).not.toBeInTheDocument();
  });

  it("reports no matches when there is a query", () => {
    render(<ZeroStatePassages hasQuery onClearSearch={vi.fn()} />);
    expect(screen.getByText("No matching passages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "clear your search" })).toBeInTheDocument();
  });

  it("calls onClearSearch when clearing the search", async () => {
    const onClearSearch = vi.fn();
    render(<ZeroStatePassages hasQuery onClearSearch={onClearSearch} />);
    await userEvent.click(screen.getByRole("button", { name: "clear your search" }));
    expect(onClearSearch).toHaveBeenCalledOnce();
  });
});
