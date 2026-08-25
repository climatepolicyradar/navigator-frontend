import { render, screen, fireEvent } from "@testing-library/react";

import { SearchDocument } from "@/api/search";

import { DocumentCard } from "./DocumentCard";

const baseDocument: SearchDocument = {
  id: "doc-1",
  title: "National Climate Strategy",
  description: null,
  labels: [{ type: "category", value: { id: "cat-1", type: "category", value: "Policy" }, count: null, timestamp: null }],
  documents: [],
  items: [],
  attributes: { published_date: "2023-06-15" },
};

describe("DocumentCard", () => {
  it("renders the document title", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("National Climate Strategy");
  });

  it("renders the published year", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("renders nothing for year when published_date is absent", () => {
    const doc = { ...baseDocument, attributes: {} };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.queryByText("2023")).not.toBeInTheDocument();
  });

  it("renders the description", () => {
    const doc = { ...baseDocument, description: "A short description." };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText("A short description.")).toBeInTheDocument();
  });

  it("renders the full description without truncation, relying on CSS line clamping", () => {
    const long = "a".repeat(300);
    const doc = { ...baseDocument, description: long };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText(long)).toBeInTheDocument();
    expect(screen.queryByText(long + "...")).not.toBeInTheDocument();
  });

  it("does not render a description element when description is null", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders the document type from the category label", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.getByText("Policy")).toBeInTheDocument();
  });

  it("renders a country geography label with its flag emoji", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: `geo${"::"}FRA`, type: "country", value: "France" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText((_, element) => element?.tagName === "SPAN" && element.textContent === "🇫🇷 France")).toBeInTheDocument();
  });

  it("shows a count of additional geographies of the same specificity", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: "geo-1", type: "country", value: "France" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-2", type: "country", value: "Germany" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText((_, element) => element?.tagName === "SPAN" && element.textContent === "France +1")).toBeInTheDocument();
    expect(screen.queryByText("Germany", { exact: false })).not.toBeInTheDocument();
  });

  it("prefers the most specific geography type when multiple types are present", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: "geo-1", type: "country", value: "United States" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-2", type: "subdivision", value: "California" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText("California", { exact: false })).toBeInTheDocument();
    expect(screen.queryByText("United States", { exact: false })).not.toBeInTheDocument();
  });

  it("falls back to region geographies when no country or subdivision label is present", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: "geo-1", type: "region", value: "Northern Europe" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText("Northern Europe", { exact: false })).toBeInTheDocument();
  });

  it("calls onClick with the document when the card is clicked", () => {
    const handleClick = vi.fn();
    render(<DocumentCard document={baseDocument} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(baseDocument, expect.anything());
  });

  it("sets analytics data attributes on the button", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} analytics={{ context: "search-results", page: 2, positionOffset: 10 }} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ph-capture-attribute-link-purpose", "search-results");
    expect(button).toHaveAttribute("data-ph-capture-attribute-position-page", "2");
    expect(button).toHaveAttribute("data-ph-capture-attribute-position-total", "12");
  });
});
