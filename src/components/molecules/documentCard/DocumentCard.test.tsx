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
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("National Climate Strategy");
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

  it("truncates description longer than 275 characters and appends ellipsis", () => {
    const long = "a".repeat(300);
    const doc = { ...baseDocument, description: long };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText("a".repeat(275) + "...")).toBeInTheDocument();
  });

  it("does not render a description element when description is null", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders the category label", () => {
    render(<DocumentCard document={baseDocument} onClick={() => {}} />);
    expect(screen.getByText("Policy")).toBeInTheDocument();
  });

  it("renders country geography labels", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: "geo-1", type: "country", value: "France" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-2", type: "country", value: "Germany" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.getByText("France", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Germany", { exact: false })).toBeInTheDocument();
  });

  it("excludes geography labels that are not countries", () => {
    const doc = {
      ...baseDocument,
      labels: [
        ...baseDocument.labels,
        { type: "geography", value: { id: "geo-1", type: "region", value: "Northern Europe" }, count: null, timestamp: null },
      ],
    };
    render(<DocumentCard document={doc} onClick={() => {}} />);
    expect(screen.queryByText("Northern Europe")).not.toBeInTheDocument();
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
