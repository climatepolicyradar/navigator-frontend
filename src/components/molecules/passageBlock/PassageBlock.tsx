import { Check, Copy, ExternalLink, File, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";

import { EN_DASH } from "@/constants/chars";
import { IPassageLabel } from "@/types";
import { joinNodes } from "@/utils/reactNode";
import { THighlightRange, addHighlights } from "@/utils/text/addHighlights";
import { findSubStringMatches } from "@/utils/text/findSubStringMatches";
import { resolveHighlightRanges } from "@/utils/text/resolveHighlightRanges";

const COPY_FEEDBACK_TIMEOUT = 1000;

export const QUERY_HIGHLIGHT_COLOUR = "bg-yellow-200 text-text-primary";
export const TOPIC_HIGHLIGHT_COLOURS = [
  "bg-cyan-200 text-text-primary",
  "bg-purple-200 text-text-primary",
  "bg-pink-200 text-text-primary",
  "bg-lime-200 text-text-primary",
  "bg-orange-200 text-text-primary",
];

type TPassagePage = {
  page_number: number;
};

export type TPassage = {
  id: string;
  document_id: string;
  idx: number;
  content: string;
  labels?: IPassageLabel[];
  language?: string;
  content_type?: string;
  type_confidence?: number;
  pages?: TPassagePage[];
  heading_id?: string;
  tokens?: string[];
  serialised_text?: string;
  topics?: unknown[];
  // Resolved display fields, denormalised onto the passage by the caller
  documentTitle: string;
  documentUrl?: string;
  headingText?: string;
};

type TProps = {
  passage: TPassage;
  onCopyClick?: () => void;
  onDocumentLinkClick?: () => void;
  onPassageClick?: (passage: TPassage) => void;
  query?: string;
  activeTopicsIds?: string[];
  // Hide the document title and its link when the passage is already shown in the
  // context of that document, e.g. on the document page.
  showDocument?: boolean;
};

// Define the colour for the topic highlight
const getTopicColours = (activeTopics: IPassageLabel[]) => {
  const colours = new Map<string, string>();
  activeTopics.forEach(({ value }) => {
    if (!colours.has(value.id)) colours.set(value.id, TOPIC_HIGHLIGHT_COLOURS[colours.size % TOPIC_HIGHLIGHT_COLOURS.length]);
  });

  return colours;
};

const formatPageRange = (pageNumbers: number[]): string => {
  if (pageNumbers.length <= 1) return pageNumbers[0].toString() ?? "";

  const sortedPageNumbers = [...pageNumbers].sort();
  return [sortedPageNumbers[0], sortedPageNumbers[sortedPageNumbers.length - 1]].join(EN_DASH);
};

// Define the highlight ranges - highlights are applied later, we just nede their positions and colour
const getHighlightRanges = ({
  content,
  query,
  activeTopics,
  topicColours,
}: {
  content: string;
  query?: string;
  activeTopics: IPassageLabel[];
  topicColours: Map<string, string>;
}): THighlightRange[] => [
  // The query outranks every topic. Trimmed so a query typed with surrounding spaces still matches
  ...findSubStringMatches(content, query?.trim() ?? "").map((match) => ({ ...match, className: QUERY_HIGHLIGHT_COLOUR })),
  ...activeTopics.map(({ start_index, end_index, value }) => ({
    start: start_index,
    end: end_index,
    className: topicColours.get(value.id) ?? "",
  })),
];

export const PassageBlock = ({ passage, onCopyClick, onDocumentLinkClick, onPassageClick, query, activeTopicsIds, showDocument = true }: TProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), COPY_FEEDBACK_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const isClickable = !!onPassageClick;
  // `page_number` is 0-indexed in the passage model, so is shifted for display.
  const pageNumbers = passage.pages?.map(({ page_number }) => page_number + 1) ?? [];
  const hasPages = pageNumbers.length > 0;
  const hasContext = hasPages || !!passage.headingText;
  const activeTopics = passage.labels?.filter((label) => activeTopicsIds?.includes(label.value.id)) ?? [];
  const topicColours = getTopicColours(activeTopics);
  const highlightedContent = addHighlights(
    passage.content,
    resolveHighlightRanges(passage.content, getHighlightRanges({ content: passage.content, query, activeTopics, topicColours }))
  );
  // A passage can contain multiple spans of the same highlighted topic
  const topics = [...new Map(activeTopics.map(({ value }) => [value.value, value.id]))];
  const topicsList = joinNodes(
    topics.map(([value, id]) => (
      <span key={id} className={topicColours.get(id)}>
        {value}
      </span>
    )),
    ", "
  );
  const hasFooter = showDocument || hasContext;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(passage.content);
    setHasCopied(true);
    onCopyClick?.();
  };

  return (
    <div
      className={`bg-bg-primary border border-border-normal rounded-xl overflow-clip transition ${isClickable ? "hocus:shadow-sm " : "shadow-xs"}`}
    >
      <div className="text-sm text-text-primary">
        {isClickable ? (
          <button
            type="button"
            onClick={() => onPassageClick(passage)}
            className="text-left w-full text-sm text-text-primary p-6 cols-3:px-8 cols-3:py-7"
          >
            <p>{highlightedContent}</p>
            {activeTopics.length > 0 && <p className="text-text-secondary mt-2">Contains: {topicsList}</p>}
          </button>
        ) : (
          <div className="p-6 cols-3:px-8 cols-3:py-7">
            <p>{highlightedContent}</p>
            {activeTopics.length > 0 && <p className="text-text-secondary mt-2">Contains: {topicsList}</p>}
          </div>
        )}
      </div>
      {hasFooter && (
        <div className="bg-paper px-6 cols-3:px-8 py-3 flex gap-16 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
            {showDocument && (
              <div className="flex gap-2 items-center">
                <File size={16} className="text-elem-icon shrink-0" />
                <p className="text-sm text-text-primary truncate">{passage.documentTitle}</p>
              </div>
            )}
            {hasContext && (
              <div className="flex gap-4 items-center">
                {hasPages && (
                  <div className="flex gap-2 items-center shrink-0">
                    <LocateFixed size={16} className="text-elem-icon" />
                    <p className="text-sm text-text-primary whitespace-nowrap">
                      {pageNumbers.length === 1 ? "Page" : "Pages"} {formatPageRange(pageNumbers)}
                    </p>
                  </div>
                )}
                {passage.headingText && (
                  <>
                    {hasPages && <span className="w-px h-3 bg-border-normal shrink-0" />}
                    <p className="text-sm text-text-primary truncate">{passage.headingText}</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center shrink-0">
            {showDocument && (
              <button type="button" onClick={onDocumentLinkClick} aria-label="View document" className="text-elem-icon hocus:text-inky-blue">
                <ExternalLink size={16} />
              </button>
            )}
            <button type="button" onClick={handleCopyClick} aria-label="Copy passage text" className="text-elem-icon hocus:text-inky-blue">
              {hasCopied ? <Check size={16} className="text-inky-blue" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
