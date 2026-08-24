import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { addSubStringHighlights } from "./addSubStringHighlights";

describe("addSubStringHighlights", () => {
  it("highlights a match made of standard characters", () => {
    const { container } = render(<>{addSubStringHighlights("Documents", "cum", "bg-yellow-200")}</>);

    expect(container.textContent).toBe("Documents");
    const highlighted = container.querySelector("span");
    expect(highlighted).toHaveTextContent("cum");
    expect(highlighted).toHaveClass("bg-yellow-200");
  });

  it("highlights a match containing non-expanding diacritics when the search term omits them", () => {
    const { container } = render(<>{addSubStringHighlights("Seyðisfjörður", "fjor", "bg-yellow-200")}</>);

    expect(container.textContent).toBe("Seyðisfjörður");
    const highlighted = container.querySelector("span");
    expect(highlighted).toHaveTextContent("fjör");
    expect(highlighted).toHaveClass("bg-yellow-200");
  });

  it("highlights a match containing an expanding character (ß) when the search term uses its expansion", () => {
    const { container } = render(<>{addSubStringHighlights("Straße", "asse", "bg-yellow-200")}</>);

    expect(container.textContent).toBe("Straße");
    const highlighted = container.querySelector("span");
    expect(highlighted).toHaveTextContent("aße");
    expect(highlighted).toHaveClass("bg-yellow-200");
  });
});
