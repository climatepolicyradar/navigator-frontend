import { FileSearch2, ScanSearch } from "lucide-react";

type TEmptyStateProps = {
  cssClass?: string;
  hasQuery: boolean;
  onClearClick: () => void;
  subject?: string;
};

export const EmptyPassages = ({ hasQuery, onClearClick, subject = "this document", cssClass }: TEmptyStateProps) => (
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
  </div>
);
