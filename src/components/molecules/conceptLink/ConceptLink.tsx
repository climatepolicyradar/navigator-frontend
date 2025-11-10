import { useState } from "react";

import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

interface IProps {
  concept: TConcept;
  label?: string;
  children?: React.ReactNode;
  onClick?: (concept: TConcept) => void;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, label, onClick, triggerClasses = "", children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline underline underline-offset-2 decoration-dotted",
    isOpen ? "decoration-text-primary" : "decoration-text-quaternary",
    onClick ? "" : "!cursor-help",
    triggerClasses
  );

  const title = label ?? firstCase(concept.preferred_label);

  const trigger = (
    <button className={allTriggerClasses} onClick={() => (onClick ? onClick(concept) : null)}>
      {title}
    </button>
  );

  return children ? (
    <Popover openOnHover onOpenChange={setIsOpen} trigger={trigger}>
      {children}
    </Popover>
  ) : (
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
