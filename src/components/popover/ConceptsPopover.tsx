import { TConcept } from "@types";

type TProps = {
  concept?: TConcept;
  onClose: () => void;
};

export const ConceptsPopover = ({ concept, onClose }: TProps) => {
  return (
    <div className="w-64 h-64 p-4 bg-white rounded-lg shadow-[0px_4px_36px_0px_rgba(0,0,0,0.08)] border border-gray-200 justify-start items-center gap-2.5 inline-flex">
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-6 inline-flex">
        <div className="self-stretch h-56 flex-col justify-start items-start gap-6 flex">
          <div className="self-stretch h-40 flex-col justify-start items-start gap-1 flex">
            <div className="self-stretch text-neutral-500 text-xs font-medium font-['Inter Variable'] leading-none">Description</div>
            <div className="self-stretch text-neutral-800 text-sm font-normal font-['Inter Variable'] leading-tight">{concept.description}</div>
          </div>
          <div className="self-stretch h-10 flex-col justify-start items-start gap-1 flex">
            <div className="self-stretch text-neutral-500 text-xs font-medium font-['Inter Variable'] leading-none">Learn more</div>
            <div className="self-stretch">
              <span class="text-neutral-800 text-sm font-normal font-['Inter Variable'] underline leading-tight">View the structured data</span>
              <span class="text-neutral-800 text-sm font-normal font-['Inter Variable'] leading-tight"> </span>
              <span class="text-neutral-500 text-sm font-normal font-['Inter Variable'] leading-tight">↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
