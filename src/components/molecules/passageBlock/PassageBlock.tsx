import { Check, Copy, ExternalLink, File, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";

import { ProductSupport } from "@/components/molecules/productSupport/ProductSupport";
import { EN_DASH } from "@/constants/chars";
import { IPassageBolding, IPassageLabel } from "@/types";
import { joinNodes } from "@/utils/reactNode";
import { THighlightRange, addHighlights } from "@/utils/text/addHighlights";
import { resolveHighlightRanges } from "@/utils/text/resolveHighlightRanges";

const COPY_FEEDBACK_TIMEOUT = 1000;

export const QUERY_HIGHLIGHT_COLOUR = "bg-yellow-200 text-text-primary";

type TPassagePage = {
  page_number: number;
};

// Resolved display fields, denormalised onto the passage by the caller
export type TPassage = {
  boldings: IPassageBolding[];
  content: string;
  document_id: string;
  documentTitle: string;
  headingText?: string;
  id: string;
  idx: number;
  labels?: IPassageLabel[];
  pages?: TPassagePage[];
  topics?: unknown[];
};

type TPassageAnalytics = {
  context?: string;
  position?: number;
  sort?: string;
  total?: number;
};

type TProps = {
  passage: TPassage;
  analytics?: TPassageAnalytics;
  onCopyClick?: () => void;
  onDocumentLinkClick?: () => void;
  onPassageClick?: (passage: TPassage) => void;
  // The active topics' IDs, mapped to their highlight colour. Assigned by the caller so a
  // topic has the same colour in every passage of a list.
  topicColours?: Map<string, string>;
  // Hide the document title and its link when the passage is already shown in the
  // context of that document, e.g. on the document page.
  showDocument?: boolean;
};

const formatPageRange = (pageNumbers: number[]): string => {
  if (pageNumbers.length <= 1) return pageNumbers[0].toString() ?? "";

  const sortedPageNumbers = [...pageNumbers].sort();
  return [sortedPageNumbers[0], sortedPageNumbers[sortedPageNumbers.length - 1]].join(EN_DASH);
};

// Define the highlight ranges - highlights are applied later, we just nede their positions and colour
const getHighlightRanges = ({
  activeTopics,
  boldings,
  topicColours,
}: {
  activeTopics: IPassageLabel[];
  boldings: IPassageBolding[];
  topicColours: Map<string, string>;
}): THighlightRange[] => [
  // The query string matches (a.k.a boldings) are always in yellow and treated as query matches
  ...boldings.map(({ start_index, end_index }) => ({
    start: start_index,
    end: end_index,
    className: QUERY_HIGHLIGHT_COLOUR,
  })),
  ...activeTopics.map(({ start_index, end_index, value }) => ({
    start: start_index,
    end: end_index,
    className: topicColours.get(value.id) ?? "",
  })),
];

export const PassageBlock = ({
  passage,
  analytics,
  onCopyClick,
  onDocumentLinkClick,
  onPassageClick,
  topicColours = new Map(),
  showDocument = true,
}: TProps) => {
  const { context, position, sort, total } = analytics || {};
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
  const activeTopics = passage.labels?.filter((label) => topicColours.has(label.value.id)) ?? [];
  const highlightedContent = addHighlights(
    passage.content,
    resolveHighlightRanges(passage.content, getHighlightRanges({ boldings: passage.boldings, activeTopics, topicColours }))
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
            data-ph-capture-attribute-link-purpose={context ?? "passage"}
            data-ph-capture-attribute-position-total={position}
            data-ph-capture-attribute-results-total={total}
            data-ph-capture-attribute-passage-idx={passage.idx}
            data-ph-capture-attribute-document-id={passage.document_id}
            data-ph-capture-attribute-sort={sort}
            className="text-left w-full text-sm text-text-primary p-6 cols-3:px-8 cols-3:py-7"
          >
            <p>{highlightedContent}</p>
            {activeTopics.length > 0 && (
              <p className="text-text-secondary mt-2">
                Contains: {topicsList} <ProductSupport content="textHighlighting" tooltip nestedButton className="align-text-bottom" />
              </p>
            )}
          </button>
        ) : (
          <div className="p-6 cols-3:px-8 cols-3:py-7">
            <p>{highlightedContent}</p>
            {activeTopics.length > 0 && (
              <p className="text-text-secondary mt-2">
                Contains: {topicsList} <ProductSupport content="textHighlighting" tooltip nestedButton className="align-text-bottom" />
              </p>
            )}
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
