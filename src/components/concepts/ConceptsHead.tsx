import { ExternalLink } from "@components/ExternalLink";

export const ConceptsHead = () => {
  return (
    <div className="mb-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-neutral-800">Climate concepts</h2>
          <span className="bg-blue-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">Beta</span>
        </div>
        <div className="pl-4 border-l-2 border-blue-600">
          <p className="text-sm text-neutral-600">
            This feature automatically detects climate concepts in documents. Accuracy is not 100%.{" "}
            <ExternalLink url="https://climatepolicyradar.org/concepts" className="text-gray-600 underline">
              Learn more
            </ExternalLink>
          </p>
        </div>
      </div>
    </div>
  );
};
