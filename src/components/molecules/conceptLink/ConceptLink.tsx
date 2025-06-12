import startCase from "lodash/startCase";
import { useState } from "react";

import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  concept: TConcept;
  onClick?: (concept: TConcept) => void;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, onClick, triggerClasses = "" }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline capitalize underline underline-offset-2 decoration-dotted",
    isOpen ? "decoration-text-primary" : "decoration-text-quaternary",
    onClick ? "" : "cursor-help",
    triggerClasses
  );

  const title = startCase(concept.preferred_label);

  const trigger = onClick ? (
    <button className={allTriggerClasses} onClick={() => onClick(concept)}>
      {title}
    </button>
  ) : (
    <span className={allTriggerClasses}>{title}</span>
  );

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={trigger}
      title={title}
      description={concept.description}
      link={{
        href: getConceptStoreLink(concept.wikibase_id),
        text: "Source",
        external: true,
      }}
    />
  );
};
