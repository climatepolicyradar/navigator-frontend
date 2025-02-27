import { ConceptsHead } from "./ConceptsHead";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ConceptsPopover } from "@components/popover/ConceptsPopover";
import Button from "@components/buttons/Button";
import Link from "next/link";
import { TConcept } from "@types";
import { useCallback, useState } from "react";

type TProps = {
  concepts: TConcept[];
  rootConcepts: TConcept[];
  conceptCountsById: Record<string, number>;
  onConceptClick?: (conceptLabel: string) => void;
};

export const ConceptsPanel = ({ rootConcepts, concepts, conceptCountsById, onConceptClick }: TProps) => {
  const [openPopoverIds, setOpenPopoverIds] = useState<string[]>([]);

  const handleConceptClick = useCallback(
    (conceptLabel: string) => {
      onConceptClick?.(conceptLabel);
    },
    [onConceptClick]
  );

  return (
    <div className="pb-4">
      <div className="mt-4 grow-0 shrink-0">
        <ConceptsHead></ConceptsHead>
      </div>

      {rootConcepts.map((rootConcept) => {
        const hasConceptsInRootConcept = concepts.filter((concept) => concept.subconcept_of.includes(rootConcept.wikibase_id));
        if (hasConceptsInRootConcept.length === 0) return null;
        return (
          <div key={rootConcept.wikibase_id} className="pt-6 pb-6 relative group">
            <div className="flex items-center gap-2">
              <p className="capitalize text-neutral-800 text-base font-medium leading-normal flex-grow">{rootConcept.preferred_label}</p>
              <div className="relative pr-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenPopoverIds(
                      openPopoverIds.includes(rootConcept.wikibase_id)
                        ? openPopoverIds.filter((id) => id !== rootConcept.wikibase_id)
                        : [...openPopoverIds, rootConcept.wikibase_id]
                    );
                  }}
                  className="text-neutral-500 flex items-center z-50"
                >
                  <HiOutlineDotsHorizontal className="text-xl group-hover:border-neutral-200 border-transparent border-1 rounded-full p-0.5" />
                </button>

                {openPopoverIds.includes(rootConcept.wikibase_id) && (
                  <div className="absolute z-50 top-full right-3 mt-2">
                    <ConceptsPopover
                      concept={rootConcept}
                      onClose={() => setOpenPopoverIds(openPopoverIds.filter((id) => id !== rootConcept.wikibase_id))}
                    />
                  </div>
                )}
              </div>
            </div>
            <ul className="flex flex-wrap gap-2 mt-4">
              {concepts
                .filter((concept) => concept.subconcept_of.includes(rootConcept.wikibase_id))
                .map((concept) => {
                  return (
                    <li key={concept.wikibase_id}>
                      <Link
                        className="capitalize hover:no-underline"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleConceptClick?.(concept.preferred_label);
                        }}
                      >
                        <Button
                          color="clear-blue"
                          data-cy="view-document-viewer-concept"
                          extraClasses="capitalize flex items-center text-neutral-600 text-sm font-normal leading-tight"
                        >
                          {concept.preferred_label} {conceptCountsById[concept.wikibase_id]}
                        </Button>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
