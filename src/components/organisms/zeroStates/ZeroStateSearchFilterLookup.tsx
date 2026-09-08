import { LucideScanSearch } from "lucide-react";

interface IProps {
  labelTaxonomy: string;
  setSearchText: (text: string) => void;
}

export const ZeroStateSearchFilterLookup = ({ labelTaxonomy, setSearchText }: IProps) => (
  <div className="p-4 flex flex-col items-center">
    <div className="p-3 bg-[#1A4F8C0D] rounded-full">
      <LucideScanSearch size={24} className="text-text-brand" />
    </div>
    <span className="mt-2 mb-1 text-sm text-text-primary font-medium leading-6">No matching {labelTaxonomy}</span>
    <p className="text-sm text-text-secondary font-normal leading-6">
      <button type="button" onClick={() => setSearchText("")} className="inline text-text-brand underline">
        Clear quick search
      </button>{" "}
      to continue
    </p>
  </div>
);
