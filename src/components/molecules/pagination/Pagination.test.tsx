import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  trigger(width: number) {
    this.callback([{ contentRect: { width } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

const triggerResize = (width: number) => {
  const observer = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
  act(() => observer.trigger(width));
};

describe("Pagination", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    MockResizeObserver.instances = [];
    window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("renders narrow pagination when the measured width is below the breakpoint", () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={vi.fn()} />);
    triggerResize(400);

    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "9" })).not.toBeInTheDocument();
  });

  it("renders wide pagination when the measured width is at or above the breakpoint", () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={vi.fn()} />);
    triggerResize(520);

    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "10" })).not.toBeInTheDocument();
  });

  it("switches between narrow and wide as the measured width changes", () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={vi.fn()} />);

    triggerResize(520);
    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();

    triggerResize(400);
    expect(screen.queryByRole("button", { name: "9" })).not.toBeInTheDocument();
  });
});
