import { LucideScanSearch } from "lucide-react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { SUGGESTED_SEARCHES } from "@/cpr/constants/suggestedSearches";

export const ZeroStateSERPNoSearch = () => {
  return (
    <div className="px-5 py-8 flex flex-col items-center gap-4 border border-border-normal rounded-lg">
      <div className="p-3 bg-[#1A4F8C0D] rounded-full">
        <LucideScanSearch size={24} className="text-text-brand" />
      </div>
      <div className="max-w-75 text-center">
        <span className="block mb-2.5 text-base text-text-primary font-medium leading-6">Search or filter to discover documents</span>
        <p className="text-base text-text-secondary font-normal leading-6">We search and display specific passages within documents. Try...</p>
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
