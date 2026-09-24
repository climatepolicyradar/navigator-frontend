import sortBy from "lodash/sortBy";
import { ReactNode } from "react";

import { Geography, labelIsRegion } from "@/components/molecules/geographies/Geography";
import { ARROW_RIGHT } from "@/constants/chars";
import { TLabel, TSingularAndPlural } from "@/types";
import { flattenNestedLabels } from "@/utils/labels/flattenNestedLabels";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { joinTailwindClasses } from "@/utils/tailwind";

export const GEOGRAPHY_LABEL_TYPES = ["region", "country", "subdivision"]; // Ordered least to most specific

interface IProps {
  className?: string;
  geographyLabels: TLabel[];
  hierarchySeparator?: string;
  limit?: number;
  limitSuffix?: TSingularAndPlural;
  limitOnClick?: () => void;
  linkClasses?: string;
  noLinks?: boolean;
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
  noLinks = false,
  separatorClasses,
  showFlags = true,
}: IProps) => {
  if (geographyLabels.length === 0) return <span className="text-text-tertiary">No geography</span>;

  const sortedLabels = sortBy(flattenNestedLabels(geographyLabels), [(label) => GEOGRAPHY_LABEL_TYPES.indexOf(label.type), "value"]);
  // Only show regions if there are only regions to show
  const displayLabels = sortedLabels.every(labelIsRegion) ? sortedLabels : sortedLabels.filter((label) => !labelIsRegion(label));

  let geographies: ReactNode[] = displayLabels.map((label) => (
    <Geography key={label.id} geographyLabel={label} linkClasses={linkClasses} noLink={noLinks} showFlag={showFlags} />
  ));

  // Hierarchical separator only if a country + subdivision pair
  const isCountryAndSubdivision = displayLabels.length === 2 && displayLabels[0].type === "country" && displayLabels[1].type === "subdivision";
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
