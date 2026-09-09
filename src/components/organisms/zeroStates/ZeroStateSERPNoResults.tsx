import { LucideScanSearch } from "lucide-react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { SUGGESTED_SEARCHES } from "@/cpr/constants/suggestedSearches";

interface IProps {
  onClearSearch: () => void;
}

export const ZeroStateSERPNoResults = ({ onClearSearch }: IProps) => {
  return (
    <div className="px-5 py-8 flex flex-col items-center gap-4 border border-border-normal rounded-lg">
      <div className="p-3 bg-[#1A4F8C0D] rounded-full">
        <LucideScanSearch size={24} className="text-text-brand" />
      </div>
      <div className="max-w-75 text-center">
        <span className="block mb-2.5 text-base text-text-primary font-medium leading-6">No matching documents</span>
        <p className="text-base text-text-secondary font-normal leading-6">
          Remove filters,{" "}
          <button
            type="button"
            onClick={() => onClearSearch()}
            className="inline text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
          >
            clear search
          </button>{" "}
          or try these searches...
        </p>
      </div>
      <ul className="flex flex-wrap justify-center gap-2 w-[60%]">
        {SUGGESTED_SEARCHES.map((suggestion) => (
          <li key={suggestion.label}>
            <PageLink
              href="/_search"
              query={suggestion.newParams}
              className="block px-3 py-1.5 border border-border-normal rounded-full text-base text-text-brand font-medium leading-5"
            >
              {suggestion.label}
            </PageLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
