import { TConcept } from "@types";
import { getConceptStoreLink } from "@utils/getConceptStoreLink";

type TProps = {
  concept?: TConcept;
  onClose: () => void;
};

export const ConceptsPopover = ({ concept, onClose }: TProps) => {
  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex items-start">
      <div className="space-y-6 w-full">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-neutral-500">Description</h3>
          <p className="text-sm text-neutral-800">{concept?.description || "No description available"}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-neutral-500">Learn more</h3>
          <div className="text-sm">
            <a href={getConceptStoreLink(concept.wikibase_id)} className="text-neutral-800 underline" target="_blank">
              View the structured data
              <span className="text-neutral-500 ml-1">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
