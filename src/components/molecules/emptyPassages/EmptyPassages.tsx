import { FileSearch2, ScanSearch } from "lucide-react";

import { TTopic } from "@/types";

type TEmptyStateProps = {
  cssClass?: string;
  concepts: TTopic[];
  hasQuery: boolean;
  onClearClick: () => void;
  onConceptClick: (label: string) => void;
  subject?: string;
};

export const EmptyPassages = ({ concepts, hasQuery, onClearClick, onConceptClick, subject = "this document", cssClass }: TEmptyStateProps) => (
  <div className={`flex flex-col gap-8 py-10 ${cssClass || ""}`}>
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="rounded-full bg-bg-flat p-4 text-elem-icon">{hasQuery ? <ScanSearch size={24} /> : <FileSearch2 size={24} />}</div>
      <p className="font-medium text-text-primary">{hasQuery ? "No matching passages" : "Search passages"}</p>
      <p className="max-w-xs text-sm text-text-secondary">
        {hasQuery ? (
          <>
            Remove filters,{" "}
            <button type="button" onClick={onClearClick} className="underline text-text-brand hocus:text-text-primary">
              clear your search
            </button>{" "}
            or try a commonly mentioned topic below.
          </>
        ) : (
          `Type a search or select from topics that appear in ${subject}.`
        )}
      </p>
    </div>
    {concepts.length > 0 && (
      <div className="flex flex-col gap-3 border-t border-border-light pt-6">
        <p className="text-sm text-text-secondary">Commonly mentioned in {subject}</p>
        <ul className="flex flex-wrap gap-2">
          {concepts.map((concept) => (
            <li key={concept.wikibase_id}>
              <button
                type="button"
                onClick={() => onConceptClick(concept.preferred_label)}
                className="rounded-full border border-border-normal px-3 py-1 text-sm font-medium text-text-brand hocus:border-inky-blue hocus:bg-bg-flat"
              >
                {concept.preferred_label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
