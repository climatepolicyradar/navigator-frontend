import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { addHighlights } from "./addHighlights";

const TEXT = "Climate adaptation and mitigation";

describe("addHighlights", () => {
  it("highlights a single range", () => {
    const { container } = render(<>{addHighlights(TEXT, [{ start: 0, end: 7, className: "one" }])}</>);

    expect(container.textContent).toBe(TEXT);
    const highlighted = container.querySelectorAll("span");
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent("Climate");
  });

  it("highlights every range rather than only the last one", () => {
    const ranges = [
      { start: 0, end: 7, className: "one" },
      { start: 8, end: 18, className: "two" },
      { start: 23, end: 33, className: "three" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    expect(container.textContent).toBe(TEXT);
    expect([...container.querySelectorAll("span")].map((span) => span.textContent)).toEqual(["Climate", "adaptation", "mitigation"]);
  });

  it("gives each range its own class", () => {
    const ranges = [
      { start: 0, end: 7, className: "one" },
      { start: 8, end: 18, className: "two" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    expect([...container.querySelectorAll("span")].map((span) => span.className)).toEqual(["one", "two"]);
  });

  it("highlights ranges given out of order", () => {
    const ranges = [
      { start: 23, end: 33, className: "two" },
      { start: 0, end: 7, className: "one" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    expect(container.textContent).toBe(TEXT);
    expect([...container.querySelectorAll("span")].map((span) => span.textContent)).toEqual(["Climate", "mitigation"]);
  });

  it("keeps adjacent ranges as separate segments", () => {
    const ranges = [
      { start: 0, end: 7, className: "one" },
      { start: 7, end: 18, className: "two" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    expect(container.textContent).toBe(TEXT);
    expect([...container.querySelectorAll("span")].map((span) => span.className)).toEqual(["one", "two"]);
  });

  it("ignores zero-length and inverted ranges", () => {
    const ranges = [
      { start: 0, end: 0, className: "one" },
      { start: 12, end: 4, className: "two" },
    ];

    expect(addHighlights(TEXT, ranges)).toBe(TEXT);
  });

  it("clamps ranges that reach beyond the text", () => {
    const { container } = render(<>{addHighlights(TEXT, [{ start: 23, end: 999, className: "one" }])}</>);

    expect(container.textContent).toBe(TEXT);
    expect(container.querySelector("span")).toHaveTextContent("mitigation");
  });

  it("returns the plain text when there is nothing to highlight", () => {
    expect(addHighlights(TEXT, [])).toBe(TEXT);
  });

  it("does not render an empty segment when a range starts at the beginning or ends at the end", () => {
    const ranges = [
      { start: 0, end: 7, className: "one" },
      { start: 23, end: 33, className: "two" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    expect(container.childNodes).toHaveLength(3);
    expect(container.firstChild).toHaveClass("one");
    expect(container.lastChild).toHaveClass("two");
  });

  it("keeps the text intact if a caller passes overlapping ranges", () => {
    const ranges = [
      { start: 0, end: 12, className: "one" },
      { start: 4, end: 18, className: "two" },
    ];

    const { container } = render(<>{addHighlights(TEXT, ranges)}</>);

    // Not this util's job to resolve — but the text must never be duplicated or lost
    expect(container.textContent).toBe(TEXT);
  });
});
