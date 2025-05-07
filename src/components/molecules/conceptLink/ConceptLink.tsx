import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { useState } from "react";

interface ConceptLinkProps {
  concept: TConcept;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, triggerClasses = "" }: ConceptLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline text-text-primary capitalize underline underline-offset-2 decoration-dotted cursor-help",
    isOpen ? "decoration-text-primary" : "decoration-text-tertiary",
    triggerClasses
  );

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={<span className={allTriggerClasses}>{concept.preferred_label}</span>}
      title={concept.preferred_label}
      description={concept.description}
      link={{
        href: `https://climatepolicyradar.wikibase.cloud/wiki/Item:${concept.wikibase_id}`,
        text: "Source",
      }}
    />
  );
};
