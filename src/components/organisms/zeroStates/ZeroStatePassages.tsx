import { LucideFileSearch2, LucideScanSearch } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

type TEmptyStateProps = {
  className?: string;
  hasQuery: boolean;
  onClearSearch: () => void;
  subject?: string;
};

export const ZeroStatePassages = ({ className, hasQuery, onClearSearch, subject = "this document" }: TEmptyStateProps) => {
  const Icon = hasQuery ? LucideScanSearch : LucideFileSearch2;
  const title = hasQuery ? "No matching passages" : "Search passages";
  const allClasses = joinTailwindClasses("px-5 py-8 flex flex-col items-center gap-4 border border-border-normal rounded-lg", className);

  return (
    <div className={allClasses}>
      <div className="p-3 bg-[#1A4F8C0D] rounded-full">
        <Icon size={24} className="text-text-brand" />
      </div>
      <div className="max-w-75 text-center">
        <span className="block mb-2.5 text-base text-text-primary font-medium leading-6">{title}</span>
        <p className="text-base text-text-secondary font-normal leading-6">
          {hasQuery ? (
            <>
              <button
                type="button"
                onClick={onClearSearch}
                className="inline text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
              >
                Clear your search
              </button>{" "}
              to continue, or start with a topic that appears in these documents...
            </>
          ) : (
            <>Type a search or select from topics that appear in {subject}...</>
          )}
        </p>
      </div>
    </div>
  );
};
