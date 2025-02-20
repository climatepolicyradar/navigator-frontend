import { ExternalLink } from "@components/ExternalLink";

export const ConceptsHead = ({}) => {
  return (
    <div className="mb-4">
      <div className="h-20 flex-col justify-start items-start gap-3 inline-flex">
        <div className="self-stretch h-6 flex-col justify-center items-start gap-4 flex">
          <div className="self-stretch rounded-md justify-start items-center gap-2 inline-flex">
            <div className="text-neutral-800 text-base font-medium font-['Inter Variable'] leading-normal">Climate concepts</div>
            <div className="p-1 bg-blue-600 rounded-sm justify-center items-center gap-2 flex">
              <div className="text-white text-xs font-medium font-['Inter Variable'] leading-3">Beta</div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-12 flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch pl-4 py-1 border-l-2 border-blue-600 justify-center items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0">
              <p className="text-neutral-600 text-sm font-normal font-['Inter Variable'] leading-tight">
                This feature automatically detects climate concepts in documents. Accuracy is not 100%.{" "}
                <ExternalLink
                  url="https://climatepolicyradar.org/concepts"
                  className="text-gray-600 text-sm font-normal font-['Inter Variable'] underline leading-tight"
                >
                  Learn more
                </ExternalLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
