import { render, screen, fireEvent } from "@testing-library/react";

import { EN_DASH } from "@/constants/chars";
import { IPassageLabel } from "@/types";

import { PassageBlock, QUERY_HIGHLIGHT_COLOUR as QUERY_COLOUR, TPassage } from "./PassageBlock";

// Colours are assigned by the caller, so any class names will do
const TOPIC_A = "topic-a";
const TOPIC_B = "topic-b";

const makeLabel = (value: string): IPassageLabel => ({
  classifier_id: `classifier-${value}`,
  end_index: 0,
  labelled_text: value,
  labellers: ["classifier"],
  start_index: 0,
  value: { id: `concept-${value}`, type: "concept", value },
});

const makeBolding = (startIndex: number, endIndex: number, labelledText: string) => ({
  start_index: startIndex,
  end_index: endIndex,
  labelled_text: labelledText,
});

// `makeLabel` leaves the span indices at zero, which suits the topic list but not the
// highlighting, so those cases build their labels against real positions in the content
const makeSpanLabel = (value: string, startIndex: number, endIndex: number): IPassageLabel => ({
  ...makeLabel(value),
  start_index: startIndex,
  end_index: endIndex,
});

const basePassage: TPassage = {
  boldings: [],
  id: "passage-1",
  document_id: "doc-1",
  idx: 12,
  content: "Certain ecological and other requirements for geohazards.",
  pages: [{ page_number: 16 }],
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
    expect(screen.getByText("Page 17")).toBeInTheDocument();
  });

  it("shows the page range when a passage spans more than one", () => {
    const passage: TPassage = { ...basePassage, pages: [{ page_number: 0 }, { page_number: 1 }, { page_number: 2 }] };
    render(<PassageBlock passage={passage} />);
    expect(screen.getByText(`Pages 1${EN_DASH}3`)).toBeInTheDocument();
  });

  it("does not render a page number for an empty pages array", () => {
    const passage: TPassage = { ...basePassage, pages: [] };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/^Pages?\b/)).not.toBeInTheDocument();
  });

  it("does not render a page number when absent", () => {
    const passage: TPassage = { ...basePassage, pages: undefined };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/^Pages?\b/)).not.toBeInTheDocument();
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
    render(
      <PassageBlock
        passage={passage}
        topicColours={
          new Map([
            ["concept-Biodiversity", TOPIC_A],
            ["concept-Renewable energy", TOPIC_B],
          ])
        }
      />
    );
    expect(screen.getByText(/^Contains:/)).toHaveTextContent("Contains: Biodiversity, Renewable energy");
  });

  it("does not render topics when labels are absent", () => {
    render(<PassageBlock passage={basePassage} />);
    expect(screen.queryByText(/Contains:/)).not.toBeInTheDocument();
  });

  it("does not render topics for an empty labels array", () => {
    const passage: TPassage = { ...basePassage, labels: [] };
    render(<PassageBlock passage={passage} />);
    expect(screen.queryByText(/Contains:/)).not.toBeInTheDocument();
  });

  it("renders topics inside the clickable passage button", () => {
    const passage: TPassage = { ...basePassage, labels: [makeLabel("Biodiversity")] };
    render(<PassageBlock passage={passage} topicColours={new Map([["concept-Biodiversity", TOPIC_A]])} onPassageClick={() => {}} />);
    expect(screen.getByRole("button", { name: /Contains: Biodiversity/ })).toBeInTheDocument();
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
    //          ^8       ^18                          ^46      ^56
    const topicPassage: TPassage = {
      ...basePassage,
      labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 46, 56)],
    };
    const topicColours = new Map([
      ["concept-Ecology", TOPIC_A],
      ["concept-Geohazards", TOPIC_B],
    ]);

    const boldings = [makeBolding(0, 7, "Climate")];
    const boldingPassage: TPassage = { ...basePassage, content: "Climate adaptation and climate mitigation", boldings };

    it("leaves the content as a single text node when there is no query and no active topics", () => {
      render(<PassageBlock passage={basePassage} />);
      expect(screen.getByText(basePassage.content).querySelector("span")).toBeNull();
    });

    it("highlights every active topic, not only the last one", () => {
      render(<PassageBlock passage={topicPassage} topicColours={topicColours} />);

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_B);
    });

    it("does not highlight a topic that is not active", () => {
      render(<PassageBlock passage={topicPassage} topicColours={new Map([["concept-Geohazards", TOPIC_B]])} />);

      expect(screen.queryByText("ecological")).not.toBeInTheDocument();
      // The topic takes the colour it was given, not one derived from its position among the labels
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_B);
    });

    it("keeps a topic's colour consistent across all of its spans", () => {
      const passage: TPassage = {
        ...basePassage,
        labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 46, 56), makeSpanLabel("Ecology", 0, 7)],
      };

      render(<PassageBlock passage={passage} topicColours={topicColours} />);

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
      expect(screen.getByText("Certain")).toHaveClass(TOPIC_A);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_B);
    });

    it("highlights every occurrence of the query", () => {
      const passage: TPassage = { ...boldingPassage, boldings: [makeBolding(0, 7, "climate"), makeBolding(23, 30, "climate")] };
      render(<PassageBlock passage={passage} />);

      const highlighted = screen.getAllByText(/^climate$/i);
      expect(highlighted).toHaveLength(2);
      highlighted.forEach((span) => expect(span).toHaveClass("bg-yellow-200"));
    });

    it("gives the query the text it shares with a topic, and starts the topic after it", () => {
      // "Climate" is both the query match and the start of the topic span 0-18
      const passage: TPassage = { ...boldingPassage, labels: [makeSpanLabel("Climate adaptation", 0, 18)] };
      render(<PassageBlock passage={passage} topicColours={new Map([["concept-Climate adaptation", TOPIC_A]])} />);

      expect(screen.getByText("Climate")).toHaveClass(QUERY_COLOUR);
      expect(screen.getByText("adaptation")).toHaveClass(TOPIC_A);
      // Nothing carries both, and the text is unchanged
      expect(screen.getByText("Climate").parentElement).toHaveTextContent(boldingPassage.content);
    });

    it("gives an earlier topic the text it shares with a later one", () => {
      const passage: TPassage = {
        ...basePassage,
        // Both spans want characters 8-18; the first label listed claims them
        labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 0, 22)],
      };

      render(<PassageBlock passage={passage} topicColours={topicColours} />);

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
      expect(screen.getByText("Certain")).toHaveClass(TOPIC_B);
      expect(screen.getByText("and")).toHaveClass(TOPIC_B);
    });

    it("highlights the content when the passage is not clickable", () => {
      render(<PassageBlock passage={topicPassage} topicColours={topicColours} />);
      expect(screen.queryByRole("button", { name: /ecological/ })).not.toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
    });

    it("highlights an active topic in the topics list in its own colour", () => {
      render(<PassageBlock passage={topicPassage} topicColours={new Map([["concept-Ecology", TOPIC_A]])} />);

      expect(screen.getByText(/^Contains:/)).toHaveTextContent("Contains: Ecology");
      expect(screen.getByText("Ecology")).toHaveClass(TOPIC_A);
      // The inactive topic is excluded from the list entirely
      expect(screen.queryByText("Geohazards")).not.toBeInTheDocument();
    });

    it("matches each topic in the list to the colour used for it in the passage", () => {
      render(<PassageBlock passage={topicPassage} topicColours={topicColours} />);

      expect(screen.getByText("Ecology")).toHaveClass(TOPIC_A);
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
      expect(screen.getByText("Geohazards")).toHaveClass(TOPIC_B);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_B);
    });

    it("does not render the topics list when no topic is active", () => {
      render(<PassageBlock passage={topicPassage} />);

      expect(screen.queryByText(/Contains:/)).not.toBeInTheDocument();
    });

    it("highlights the content when the passage is clickable", () => {
      render(<PassageBlock passage={topicPassage} topicColours={topicColours} onPassageClick={() => {}} />);
      expect(screen.getByRole("button", { name: new RegExp(basePassage.content) })).toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_A);
    });
  });

  describe("analytics", () => {
    it("sets analytics data attributes on the clickable passage", () => {
      render(<PassageBlock passage={basePassage} onPassageClick={() => {}} analytics={{ position: 3, sort: "relevance desc", total: 42 }} />);
      const button = screen.getByRole("button", { name: new RegExp(basePassage.content) });

      expect(button).toHaveAttribute("data-ph-capture-attribute-link-purpose", "passage");
      expect(button).toHaveAttribute("data-ph-capture-attribute-position-total", "3");
      expect(button).toHaveAttribute("data-ph-capture-attribute-results-total", "42");
      expect(button).toHaveAttribute("data-ph-capture-attribute-passage-idx", "12");
      expect(button).toHaveAttribute("data-ph-capture-attribute-document-id", "doc-1");
      expect(button).toHaveAttribute("data-ph-capture-attribute-sort", "relevance desc");
    });
  });
});
