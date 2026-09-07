import { LucideScanSearch } from "lucide-react";

export const EmptyTopicsFilter = () => (
  <div className="p-4 flex flex-col items-center">
    <div className="p-3 bg-[#1A4F8C0D] rounded-full">
      <LucideScanSearch size={24} className="text-text-brand" />
    </div>
    <span className="mt-2 mb-1 text-sm text-text-primary font-medium leading-6">No topics</span>
    <p className="text-sm text-text-secondary font-normal leading-6 text-center">
      There are no topics assigned to this document or group of documents
      <button
        type="button"
        onClick={() => {
          //TODO
        }}
        className="inline text-text-brand underline"
      >
        Learn more about topics
      </button>
    </p>
  </div>
);
