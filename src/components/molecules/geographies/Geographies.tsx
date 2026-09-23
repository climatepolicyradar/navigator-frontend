import sortBy from "lodash/sortBy";
import { ReactNode } from "react";

import { Geography } from "@/components/molecules/geographies/Geography";
import { ARROW_RIGHT } from "@/constants/chars";
import { TNestedSearchLabel, TSingularAndPlural } from "@/types";
import { flattenNestedLabels } from "@/utils/labels/flattenNestedLabels";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { joinTailwindClasses } from "@/utils/tailwind";

// The only geographies to display and their order in the list
const LABEL_ORDER_BY_TYPE = ["country", "subdivision"];

interface IProps {
  className?: string;
  geographyLabels: TNestedSearchLabel[];
  hierarchySeparator: string;
  limit?: number;
  limitSuffix?: TSingularAndPlural;
  limitOnClick?: () => void;
  linkClasses?: string;
  separatorClasses?: string;
  showFlags?: boolean;
}

export const Geographies = ({
  className,
  geographyLabels,
  hierarchySeparator = ` ${ARROW_RIGHT} `,
  limit = 0,
  limitSuffix,
  limitOnClick,
  linkClasses,
  separatorClasses,
  showFlags = true,
}: IProps) => {
  const sortedLabels = sortBy(
    flattenNestedLabels(geographyLabels).filter((label) => LABEL_ORDER_BY_TYPE.includes(label.type)),
    [(label) => LABEL_ORDER_BY_TYPE.indexOf(label.type), "value"]
  );
  let geographies: ReactNode[] = sortedLabels.map((label) => (
    <Geography key={label.id} geographyLabel={label} linkClasses={linkClasses} showFlag={showFlags} />
  ));

  // Hierarchical separator only if a country + subdivision pair
  const isCountryAndSubdivision = sortedLabels.length === 2 && sortedLabels[0].type === "country" && sortedLabels[1].type === "subdivision";
  const separator = isCountryAndSubdivision ? hierarchySeparator : ", ";

  // Handle overflowing geographies if a display limit is set
  let overflow: ReactNode = null;
  if (limit > 0 && geographies.length > limit) {
    const hiddenCount = geographies.length - limit;
    geographies = geographies.slice(0, limit);

    let overflowText = `+${hiddenCount}`;
    if (limitSuffix) overflowText += ` ${pluralise(hiddenCount, limitSuffix)}`;

    if (!limitOnClick) {
      overflow = <>{overflowText}</>;
    } else {
      const allLinkClasses = joinTailwindClasses(
        "text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand",
        linkClasses
      );
      overflow = (
        <button type="button" onClick={() => limitOnClick()} className={allLinkClasses}>
          {overflowText}
        </button>
      );
    }
  }

  return (
    <span className={className}>
      {joinNodes(geographies, <span className={separatorClasses}>{separator}</span>)}
      {overflow && <> {overflow}</>}
    </span>
  );
};
