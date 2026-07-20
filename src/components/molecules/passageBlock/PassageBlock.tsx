import { Check, Copy, ExternalLink, File, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";

const COPY_FEEDBACK_TIMEOUT = 1000;

type TPassagePage = {
  page_number: number;
};

export type TPassage = {
  id: string;
  document_id: string;
  idx: number;
  content: string;
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
};

export const PassageBlock = ({ passage, onCopyClick, onDocumentLinkClick, onPassageClick }: TProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), COPY_FEEDBACK_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const isClickable = !!onPassageClick;
  const pageNumber = passage.pages?.[0]?.page_number;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(passage.content);
    setHasCopied(true);
    onCopyClick?.();
  };

  return (
    <div
      className={`bg-bg-primary border border-border-normal rounded-xl overflow-clip transition ${
        isClickable ? "hocus:shadow-sm hocus:bg-paper" : "shadow-xs"
      }`}
    >
      <div className="px-8 py-7">
        {isClickable ? (
          <button type="button" onClick={() => onPassageClick(passage)} className="text-left w-full text-base text-text-primary hocus:underline">
            {passage.content}
          </button>
        ) : (
          <p className="text-base text-text-primary">{passage.content}</p>
        )}
      </div>
      <div className="bg-paper px-8 py-3 flex gap-16 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="flex gap-2 items-center">
            <File size={16} className="text-elem-icon shrink-0" />
            <p className="text-sm text-text-primary truncate">{passage.documentTitle}</p>
          </div>
          {(pageNumber !== undefined || passage.headingText) && (
            <div className="flex gap-4 items-center">
              {pageNumber !== undefined && (
                <div className="flex gap-2 items-center shrink-0">
                  <LocateFixed size={16} className="text-elem-icon" />
                  <p className="text-sm text-text-primary whitespace-nowrap">Pg. {pageNumber}</p>
                </div>
              )}
              {passage.headingText && (
                <>
                  {pageNumber !== undefined && <span className="w-px h-3 bg-border-normal shrink-0" />}
                  <p className="text-sm text-text-primary truncate">{passage.headingText}</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3 items-center shrink-0">
          <button type="button" onClick={onDocumentLinkClick} aria-label="View document" className="text-elem-icon hocus:text-inky-blue">
            <ExternalLink size={16} />
          </button>
          <button type="button" onClick={handleCopyClick} aria-label="Copy passage text" className="text-elem-icon hocus:text-inky-blue">
            {hasCopied ? <Check size={16} className="text-inky-blue" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
