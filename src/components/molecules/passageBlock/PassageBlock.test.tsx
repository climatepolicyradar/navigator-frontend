import { render, screen, fireEvent } from "@testing-library/react";

import { IPassageLabel } from "@/types";

import { PassageBlock, TPassage } from "./PassageBlock";

const makeLabel = (value: string): IPassageLabel => ({
  classifier_id: `classifier-${value}`,
  end_index: 0,
  labelled_text: value,
  labellers: ["classifier"],
  start_index: 0,
  value: { id: `concept-${value}`, type: "concept", value },
});

// `makeLabel` leaves the span indices at zero, which suits the topic list but not the
// highlighting, so those cases build their labels against real positions in the content
const makeSpanLabel = (value: string, startIndex: number, endIndex: number): IPassageLabel => ({
  ...makeLabel(value),
  start_index: startIndex,
  end_index: endIndex,
});

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

  it("renders the page number when present, shifted from the 0-indexed model", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.getByText("Pg. 17")).toBeInTheDocument();
  });

  it("lists every page when a passage spans more than one", () => {
    const passage: TPassage = { ...basePassage, pages: [{ page_number: 0 }, { page_number: 1 }, { page_number: 2 }] };
    render(<PassageBlock passage={passage} />);
    expect(screen.getByText("Pgs. 1, 2, 3")).toBeInTheDocument();
  });

  it("does not render a page number for an empty pages array", () => {
    const passage: TPassage = { ...basePassage, pages: [] };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/^Pgs?\./)).not.toBeInTheDocument();
  });

  it("does not render a page number when absent", () => {
    const passage: TPassage = { ...basePassage, pages: undefined };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/^Pgs?\./)).not.toBeInTheDocument();
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

  it("renders the label values as topics when labels are present", () => {
    const passage: TPassage = { ...basePassage, labels: [makeLabel("Biodiversity"), makeLabel("Renewable energy")] };
    render(<PassageBlock passage={passage} />);
    expect(screen.getByText("Contains topics: Biodiversity, Renewable energy")).toBeInTheDocument();
  });

  it("does not render topics when labels are absent", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.queryByText(/Contains topics:/)).not.toBeInTheDocument();
  });

  it("does not render topics for an empty labels array", () => {
    const passage: TPassage = { ...basePassage, labels: [] };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/Contains topics:/)).not.toBeInTheDocument();
  });

  it("renders topics inside the clickable passage button", () => {
    const passage: TPassage = { ...basePassage, labels: [makeLabel("Biodiversity")] };
    render(<PassageBlock passage={passage} onPassageClick={() => {}} />);
    expect(screen.getByRole("button", { name: /Contains topics: Biodiversity/ })).toBeInTheDocument();
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

  describe("highlighting", () => {
    // "Certain ecological and other requirements for geohazards."
    //          ^8    ^18                                ^46   ^56
    const topicPassage: TPassage = {
      ...basePassage,
      labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 46, 56)],
    };
    const activeTopicsIds = ["concept-Ecology", "concept-Geohazards"];

    const repeatedPassage: TPassage = { ...basePassage, content: "Climate adaptation and climate mitigation" };

    it("leaves the content as a single text node when there is no query and no active topics", () => {
      render(<PassageBlock passage={basePassage} />);
      expect(screen.getByText(basePassage.content).querySelector("span")).toBeNull();
    });

    it("highlights every active topic, not only the last one", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} />);

      expect(screen.getByText("ecological")).toHaveClass("bg-light-blue");
      expect(screen.getByText("geohazards")).toHaveClass("bg-light-blue");
    });

    it("does not highlight a topic that is not active", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={["concept-Geohazards"]} />);

      expect(screen.queryByText("ecological")).not.toBeInTheDocument();
      expect(screen.getByText("geohazards")).toHaveClass("bg-light-blue");
    });

    it("highlights every occurrence of the query", () => {
      render(<PassageBlock passage={repeatedPassage} query="climate" />);

      const highlighted = screen.getAllByText(/^climate$/i);
      expect(highlighted).toHaveLength(2);
      highlighted.forEach((span) => expect(span).toHaveClass("bg-yellow-200"));
    });

    it("matches a query the user typed with surrounding spaces", () => {
      render(<PassageBlock passage={repeatedPassage} query="  climate  " />);
      expect(screen.getAllByText(/^climate$/i)).toHaveLength(2);
    });

    it("does not highlight anything for an empty or whitespace-only query", () => {
      const { unmount } = render(<PassageBlock passage={repeatedPassage} query="" />);
      expect(screen.getByText(repeatedPassage.content).querySelector("span")).toBeNull();
      unmount();

      render(<PassageBlock passage={repeatedPassage} query="   " />);
      expect(screen.getByText(repeatedPassage.content).querySelector("span")).toBeNull();
    });

    it("splits the fill of a span matched by both the query and an active topic", () => {
      // The topic is named so that it cannot be confused with the highlighted content
      const passage: TPassage = { ...repeatedPassage, labels: [makeSpanLabel("Climate action", 0, 7)] };
      render(<PassageBlock passage={passage} query="climate" activeTopicsIds={["concept-Climate action"]} />);

      // The query colour fills the top half and the topic colour the bottom, per line
      expect(screen.getByText("Climate")).toHaveClass(
        "bg-linear-to-b",
        "from-yellow-200",
        "from-50%",
        "to-light-blue",
        "to-50%",
        "box-decoration-clone"
      );
      expect(screen.getByText("climate")).toHaveClass("bg-yellow-200");
    });

    it("highlights the content when the passage is not clickable", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} />);
      expect(screen.queryByRole("button", { name: /ecological/ })).not.toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass("bg-light-blue");
    });

    it("highlights an active topic in the topics list", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={["concept-Ecology"]} />);

      // The active topic is its own element now, so the list reads as one string but is not one node
      expect(screen.getByText(/^Contains topics:/)).toHaveTextContent("Contains topics: Ecology, Geohazards");
      expect(screen.getByText("Ecology")).toHaveClass("bg-light-blue");
      // The inactive topic stays as plain text alongside it
      expect(screen.queryByText("Geohazards")).not.toBeInTheDocument();
    });

    it("highlights every active topic in the topics list", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} />);

      expect(screen.getByText("Ecology")).toHaveClass("bg-light-blue");
      expect(screen.getByText("Geohazards")).toHaveClass("bg-light-blue");
    });

    it("does not highlight any topic in the list when none are active", () => {
      render(<PassageBlock passage={topicPassage} />);

      expect(screen.getByText("Contains topics: Ecology, Geohazards")).toBeInTheDocument();
      expect(screen.queryByText("Ecology")).not.toBeInTheDocument();
    });

    it("highlights the content when the passage is clickable", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} onPassageClick={() => {}} />);
      expect(screen.getByRole("button", { name: new RegExp(basePassage.content) })).toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass("bg-light-blue");
    });
  });
});
