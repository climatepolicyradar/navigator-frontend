import { render, screen, fireEvent } from "@testing-library/react";

import { PassageBlock, TPassage } from "./PassageBlock";

const basePassage: TPassage = {
  id: "passage-1",
  document_id: "doc-1",
  idx: 12,
  content: "Certain ecological and other requirements for geohazards.",
  pages: [{ page_number: 16 }],
  heading_id: "heading-1",
  documentTitle: "Renewable Energy Sources Act",
  headingText: "Section 4: National Target 16",
};

describe("PassageBlock", () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
  });

  it("renders the passage content", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.getByText(basePassage.content)).toBeInTheDocument();
  });

  it("renders the document title", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.getByText("Renewable Energy Sources Act")).toBeInTheDocument();
  });

  it("renders the page number when present", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.getByText("Pg. 16")).toBeInTheDocument();
  });

  it("does not render a page number when absent", () => {
    const passage: TPassage = { ...basePassage, pages: undefined };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/^Pg\./)).not.toBeInTheDocument();
  });

  it("renders the heading text when present", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.getByText("Section 4: National Target 16")).toBeInTheDocument();
  });

  it("does not render heading text when absent", () => {
    const passage: TPassage = { ...basePassage, headingText: undefined };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText("Section 4: National Target 16")).not.toBeInTheDocument();
  });

  it("renders the passage text as plain text when onPassageClick is not provided", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.queryByRole("button", { name: basePassage.content })).not.toBeInTheDocument();
  });

  it("renders the passage text as a button and calls onPassageClick when provided", () => {
    const handlePassageClick = vi.fn();
    render(<PassageBlock passage={basePassage} onPassageClick={handlePassageClick} />);
    fireEvent.click(screen.getByRole("button", { name: basePassage.content }));
    expect(handlePassageClick).toHaveBeenCalledTimes(1);
    expect(handlePassageClick).toHaveBeenCalledWith(basePassage);
  });

  it("calls onDocumentLinkClick when the document link icon is clicked", () => {
    const handleDocumentLinkClick = vi.fn();
    render(<PassageBlock passage={basePassage} onDocumentLinkClick={handleDocumentLinkClick} />);
    fireEvent.click(screen.getByRole("button", { name: "View document" }));
    expect(handleDocumentLinkClick).toHaveBeenCalledTimes(1);
  });

  it("copies the passage content and calls onCopyClick when the copy icon is clicked", () => {
    const handleCopyClick = vi.fn();
    render(<PassageBlock passage={basePassage} onCopyClick={handleCopyClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy passage text" }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(basePassage.content);
    expect(handleCopyClick).toHaveBeenCalledTimes(1);
  });
});
