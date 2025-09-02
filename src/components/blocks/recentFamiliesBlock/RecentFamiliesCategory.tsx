import { motion, AnimatePresence } from "framer-motion";
import { LucideChevronDownCircle } from "lucide-react";
import Link from "next/link";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ARROW_RIGHT } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { pluralise } from "@/utils/pluralise";
import { joinTailwindClasses } from "@/utils/tailwind";

import { RecentFamilyCard } from "./RecentFamilyCard";

interface IProps {
  categorySummary: TCategorySummary | null;
  showAccordion?: boolean;
  isExpanded?: boolean;
  onAccordionClick?: () => void;
  geographySlug: string;
}

export const RecentFamiliesCategory = ({
  categorySummary: { count, families, title, unit },
  showAccordion = false,
  isExpanded = true,
  onAccordionClick,
  geographySlug,
}: IProps) => {
  const clickAccordion = () => {
    onAccordionClick?.();
  };

  const accordionIconClasses = joinTailwindClasses("text-text-brand-darker", isExpanded && "rotate-180");

  return (
    <div className="border-b border-border-light">
      {showAccordion && (
        <div className="pt-5 mb-5">
          <button type="button" onClick={clickAccordion} className="flex items-center gap-3">
            <LucideChevronDownCircle size={20} className={accordionIconClasses} />
            <h3 className="text-lg text-text-primary font-[660] leading-tight">{title}</h3>
          </button>
        </div>
      )}
      <AnimatePresence initial={false}>
        {(!showAccordion || isExpanded) && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="closed"
            variants={{
              collapsed: { opacity: 1, height: 0 },
              open: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] } },
              closed: { opacity: 0, height: 0, transition: { duration: 0 } },
            }}
          >
            {families.length > 0 && (
              <div className="flex gap-5 items-stretch overflow-x-auto pb-2">
                {families.slice(0, 4).map((family, familyIndex) => (
                  <RecentFamilyCard key={familyIndex} family={family} />
                ))}
                {/* TODO link to the search page with the given category filtered */}
                <Link
                  href={{
                    pathname: "/search",
                    query: { [QUERY_PARAMS.country]: geographySlug, [QUERY_PARAMS.category]: title },
                  }}
                  className="min-w-16 max-w-25 flex-1 flex justify-center items-center bg-surface-brand-darker/8 text-text-brand-darker font-semibold leading-tight"
                >
                  All {ARROW_RIGHT}
                </Link>
              </div>
            )}
            <p className="mt-4 mb-12 text-sm text-text-tertiary">
              There {pluralise(count, "is", "are")} {count} {pluralise(count, ...unit)} in the database.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
