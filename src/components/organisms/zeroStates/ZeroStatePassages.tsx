import { LucideFileText, LucideFolderSearch, LucideScanSearch } from "lucide-react";

import { TPrincipalDrawerTab } from "@/components/drawers/principalDrawer/PrincipalDrawer";
import { joinTailwindClasses } from "@/utils/tailwind";

type TEmptyStateProps = {
  changeTab: (tab: TPrincipalDrawerTab) => void;
  className?: string;
  hasQuery: boolean;
  onClearSearch: () => void;
  subject?: string;
};

export const ZeroStatePassages = ({ changeTab, className, hasQuery, subject = "this document" }: TEmptyStateProps) => {
  const Icon = hasQuery ? LucideScanSearch : LucideFolderSearch;
  const title = hasQuery ? "No matching passages" : "Search passages";
  const allClasses = joinTailwindClasses("px-5 py-8 flex flex-col items-center gap-4 border border-border-normal rounded-lg", className);

  return (
    <div className={allClasses}>
      <div className="p-3 bg-[#1A4F8C0D] rounded-full">
        <Icon size={24} className="text-text-brand" />
      </div>
      <div className="max-w-120 text-center">
        <span className="block mb-2.5 text-base text-text-primary font-medium leading-6">{title}</span>
        <p className="text-base text-text-secondary font-normal leading-6">
          {hasQuery ? (
            <>
              Visit the{" "}
              <button
                onClick={() => changeTab && changeTab("about")}
                className="text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
              >
                <LucideFileText size={16} className="inline mr-1" />
                about tab
              </button>{" "}
              to find out more about {subject}, try a new search or apply a topic filter.
            </>
          ) : (
            <>
              Type a search or apply a topic filter. For more information about {subject}, visit the{" "}
              <button
                onClick={() => changeTab && changeTab("about")}
                className="text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
              >
                <LucideFileText size={16} className="inline mr-1" />
                about tab
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
