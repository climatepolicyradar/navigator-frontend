import startCase from "lodash/startCase";
import { useState } from "react";

import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  concept: TConcept;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, triggerClasses = "" }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline capitalize underline underline-offset-2 decoration-dotted cursor-help",
    isOpen ? "decoration-text-primary" : "decoration-text-quaternary",
    triggerClasses
  );

  const title = startCase(concept.preferred_label);

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={<span className={allTriggerClasses}>{title}</span>}
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
