import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ZeroStatePassages } from "./ZeroStatePassages";

describe("ZeroStatePassages", () => {
  it("prompts the user to search when there is no query", () => {
    render(<ZeroStatePassages changeTab={vi.fn()} hasQuery={false} onClearSearch={vi.fn()} />);
    expect(screen.getByText("Search passages")).toBeInTheDocument();
    expect(screen.getByText("Type a search or apply a topic filter. For more information about this document, visit the")).toBeInTheDocument();
  });

  it("names the subject it is searching", () => {
    render(<ZeroStatePassages changeTab={vi.fn()} hasQuery={false} onClearSearch={vi.fn()} subject="these documents" />);
    expect(screen.getByText("Type a search or apply a topic filter. For more information about these documents, visit the")).toBeInTheDocument();
  });

  it("does not offer to clear the search when there is no query", () => {
    render(<ZeroStatePassages changeTab={vi.fn()} hasQuery={false} onClearSearch={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Clear your search" })).not.toBeInTheDocument();
  });

  it("reports no matches when there is a query", () => {
    render(<ZeroStatePassages changeTab={vi.fn()} hasQuery onClearSearch={vi.fn()} />);
    expect(screen.getByText("No matching passages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "about tab" })).toBeInTheDocument();
  });

  it("calls changeTab when clicking the changeTab button", async () => {
    const onChangeTab = vi.fn();
    render(<ZeroStatePassages changeTab={onChangeTab} hasQuery onClearSearch={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "about tab" }));
    expect(onChangeTab).toHaveBeenCalledOnce();
  });
});
