import { ReactNode, useState } from "react";

import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

interface IProps {
  concept: TConcept;
  label?: ReactNode;
  children?: React.ReactNode;
  onClick?: (concept: TConcept) => void;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, label, onClick, triggerClasses = "", children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline underline underline-offset-4",
    isOpen ? "decoration-gray-500" : "decoration-gray-300 hover:decoration-gray-500",
    onClick ? "" : "!cursor-help",
    triggerClasses
  );

  const title = firstCase(concept.preferred_label);

  const trigger = (
    <button className={allTriggerClasses} onClick={() => (onClick ? onClick(concept) : null)}>
      {label ?? title}
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
