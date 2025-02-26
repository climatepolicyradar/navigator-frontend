import { ExternalLink } from "@components/ExternalLink";
import { Heading } from "@components/typography/Heading";
import { TConcept } from "@types";
import { getConceptStoreLink } from "@utils/getConceptStoreLink";
import { Popover } from "./Popover";

type TProps = {
  concept?: TConcept;
  onClose: () => void;
};

export const ConceptsPopover = ({ concept, onClose }: TProps) => {
  return (
    <Popover>
      <>
        <div className="space-y-1">
          <Heading level={3} className="text-xs font-medium text-neutral-500">
            Description
          </Heading>
          <p className="text-sm text-neutral-800">{concept?.description || "No description available"}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-neutral-500">Learn more</h3>
          <div className="text-sm">
            <ExternalLink url={getConceptStoreLink(concept.wikibase_id)} className="text-neutral-800 underline">
              View the structured data
              <span className="text-neutral-500 ml-1">↗</span>
            </ExternalLink>
          </div>
        </div>
      </>
    </Popover>
  );
};
