import { Check, Copy, ExternalLink, File, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";

import { IPassageLabel } from "@/types";

const COPY_FEEDBACK_TIMEOUT = 1000;

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
  // Hide the document title and its link when the passage is already shown in the
  // context of that document, e.g. on the document page.
  showDocument?: boolean;
};

export const PassageBlock = ({ passage, onCopyClick, onDocumentLinkClick, onPassageClick, showDocument = true }: TProps) => {
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
  // A passage can carry the same label for several matched spans, so each topic is only shown once.
  const topics = [...new Set(passage.labels?.map((label) => label.value.value) ?? [])];
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
            className="text-left w-full text-sm text-text-primary px-8 py-7 hocus:bg-paper"
          >
            <p>{passage.content}</p>
            {passage.labels?.length > 0 && <p className="text-text-secondary mt-2">Contains topics: {topics.join(", ")}</p>}
          </button>
        ) : (
          <div className="px-8 py-7">
            <p>{passage.content}</p>
            {passage.labels?.length > 0 && <p className="text-text-secondary mt-2">Contains topics: {topics.join(", ")}</p>}
          </div>
        )}
      </div>
      {hasFooter && (
        <div className="bg-paper px-8 py-3 flex gap-16 items-start">
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
                      {pageNumbers.length === 1 ? "Pg." : "Pgs."} {pageNumbers.join(", ")}
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
