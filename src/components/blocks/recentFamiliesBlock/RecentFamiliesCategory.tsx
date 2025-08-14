import { LucideChevronDownCircle } from "lucide-react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ARROW_RIGHT } from "@/constants/chars";
import { TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { pluralise } from "@/utils/pluralise";
import { joinTailwindClasses } from "@/utils/tailwind";

import { RecentFamilyCard } from "./RecentFamilyCard";

interface IProps {
  categorySummary: TCategorySummary | null;
  showAccordion?: boolean;
  isExpanded?: boolean;
  onAccordionClick?: () => void;
}

export const RecentFamiliesCategory = ({
  categorySummary: { count, families, title, unit },
  showAccordion = false,
  isExpanded = true,
  onAccordionClick,
}: IProps) => {
  const clickAccordion = () => {
    onAccordionClick?.();
  };

  const accordionIconClasses = joinTailwindClasses("text-text-brand-darker", isExpanded && "rotate-180");

  return (
    <div className="border-b border-border-light">
      {showAccordion && (
        <div className="py-5">
          <button type="button" onClick={clickAccordion} className="flex items-center gap-3">
            <LucideChevronDownCircle size={20} className={accordionIconClasses} />
            <h3 className="text-lg text-text-primary font-[660] leading-tight">{title}</h3>
          </button>
        </div>
      )}
      {(!showAccordion || isExpanded) && (
        <>
          <div className="flex gap-5 items-stretch overflow-x-auto pb-2">
            {families.map((family, familyIndex) => (
              <RecentFamilyCard key={familyIndex} family={family} />
            ))}
            <LinkWithQuery
              href={`#`}
              className="min-w-16 max-w-25 flex-1 flex justify-center items-center bg-surface-brand-darker/8 text-text-brand-darker font-semibold leading-tight"
            >
              All {ARROW_RIGHT}
            </LinkWithQuery>
          </div>
          <p className="mt-4 mb-12 text-sm text-text-tertiary">
            There {pluralise(count, "is", "are")} {count} {pluralise(count, ...unit)} in the database.
          </p>
        </>
      )}
    </div>
  );
};
