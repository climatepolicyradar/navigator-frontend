import { Popover } from "@/components/atoms/popover/Popover";
import { TConcept } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { startCase } from "lodash";
import { useState } from "react";

interface ConceptLinkProps {
  concept: TConcept;
  triggerClasses?: string;
}

export const ConceptLink = ({ concept, triggerClasses = "" }: ConceptLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allTriggerClasses = joinTailwindClasses(
    "inline text-text-primary capitalize underline underline-offset-2 decoration-dotted cursor-help",
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
        href: `https://climatepolicyradar.wikibase.cloud/wiki/Item:${concept.wikibase_id}`,
        text: "Source",
        external: true,
      }}
    />
  );
};
