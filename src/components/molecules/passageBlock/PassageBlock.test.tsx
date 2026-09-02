import { render, screen, fireEvent } from "@testing-library/react";

import { EN_DASH } from "@/constants/chars";
import { IPassageLabel } from "@/types";

import { PassageBlock, QUERY_HIGHLIGHT_COLOUR as QUERY_COLOUR, TOPIC_HIGHLIGHT_COLOURS as TOPIC_COLOURS, TPassage } from "./PassageBlock";

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

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_COLOURS[1]);
    });

    it("does not highlight a topic that is not active", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={["concept-Geohazards"]} />);

      expect(screen.queryByText("ecological")).not.toBeInTheDocument();
      // The only active topic takes the first colour, whatever its position among the labels
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_COLOURS[0]);
    });

    it("gives each active topic the next colour, and cycles once they run out", () => {
      // "Certain ecological and other requirements for geohazards."
      const spans: [number, number][] = [
        [0, 7],
        [8, 18],
        [19, 22],
        [23, 28],
        [29, 41],
        [42, 45],
      ];
      // One topic per colour, plus one more to wrap the cycle back to the start. Topics are
      // named so they cannot be confused with the words they mark in the content.
      const names = spans.map((_span, index) => `Topic ${index}`);
      const passage: TPassage = { ...basePassage, labels: names.map((name, index) => makeSpanLabel(name, ...spans[index])) };

      render(<PassageBlock passage={passage} activeTopicsIds={names.map((name) => `concept-${name}`)} />);

      expect(names).toHaveLength(TOPIC_COLOURS.length + 1);
      names.forEach((name, index) => {
        const colour = TOPIC_COLOURS[index % TOPIC_COLOURS.length];
        // The passage text and the topics list agree on the colour for a given topic
        expect(screen.getByText(basePassage.content.slice(...spans[index]))).toHaveClass(colour);
        expect(screen.getByText(name)).toHaveClass(colour);
      });
    });

    it("keeps a topic's colour consistent across all of its spans", () => {
      const passage: TPassage = {
        ...basePassage,
        labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 46, 56), makeSpanLabel("Ecology", 0, 7)],
      };

      render(<PassageBlock passage={passage} activeTopicsIds={activeTopicsIds} />);

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("Certain")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_COLOURS[1]);
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

    it("gives the query the text it shares with a topic, and starts the topic after it", () => {
      // "Climate" is both the query match and the start of the topic span 0-18
      const passage: TPassage = { ...repeatedPassage, labels: [makeSpanLabel("Climate action", 0, 18)] };
      render(<PassageBlock passage={passage} query="climate" activeTopicsIds={["concept-Climate action"]} />);

      expect(screen.getByText("Climate")).toHaveClass(QUERY_COLOUR);
      expect(screen.getByText("adaptation")).toHaveClass(TOPIC_COLOURS[0]);
      // Nothing carries both, and the text is unchanged
      expect(screen.getByText("Climate").parentElement).toHaveTextContent(repeatedPassage.content);
    });

    it("gives an earlier topic the text it shares with a later one", () => {
      const passage: TPassage = {
        ...basePassage,
        // Both spans want characters 8-18; the first label listed claims them
        labels: [makeSpanLabel("Ecology", 8, 18), makeSpanLabel("Geohazards", 0, 22)],
      };

      render(<PassageBlock passage={passage} activeTopicsIds={activeTopicsIds} />);

      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("Certain")).toHaveClass(TOPIC_COLOURS[1]);
      expect(screen.getByText("and")).toHaveClass(TOPIC_COLOURS[1]);
    });

    it("highlights the content when the passage is not clickable", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} />);
      expect(screen.queryByRole("button", { name: /ecological/ })).not.toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
    });

    it("highlights an active topic in the topics list in its own colour", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={["concept-Ecology"]} />);

      // The active topic is its own element now, so the list reads as one string but is not one node
      expect(screen.getByText(/^Contains topics:/)).toHaveTextContent("Contains topics: Ecology, Geohazards");
      expect(screen.getByText("Ecology")).toHaveClass(TOPIC_COLOURS[0]);
      // The inactive topic stays as plain text alongside it
      expect(screen.queryByText("Geohazards")).not.toBeInTheDocument();
    });

    it("matches each topic in the list to the colour used for it in the passage", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} />);

      expect(screen.getByText("Ecology")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
      expect(screen.getByText("Geohazards")).toHaveClass(TOPIC_COLOURS[1]);
      expect(screen.getByText("geohazards")).toHaveClass(TOPIC_COLOURS[1]);
    });

    it("does not highlight any topic in the list when none are active", () => {
      render(<PassageBlock passage={topicPassage} />);

      expect(screen.getByText("Contains topics: Ecology, Geohazards")).toBeInTheDocument();
      expect(screen.queryByText("Ecology")).not.toBeInTheDocument();
    });

    it("highlights the content when the passage is clickable", () => {
      render(<PassageBlock passage={topicPassage} activeTopicsIds={activeTopicsIds} onPassageClick={() => {}} />);
      expect(screen.getByRole("button", { name: new RegExp(basePassage.content) })).toBeInTheDocument();
      expect(screen.getByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
    });
  });
});
