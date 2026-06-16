import sortBy from "lodash/sortBy";
import { useState } from "react";

import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { TFilterPathLabel, TNestedSearchLabel, TSearchLabel, TSearchQueryGroup } from "@/types";
import { buildFilterGroup } from "@/utils/search/buildFilterGroup";

const nestSearchLabels = (labels: TSearchLabel[]): TNestedSearchLabel[] => {
  const labelsMap = new Map<string, TNestedSearchLabel>(labels.map((label) => [label.id, { ...label, children: [] as TNestedSearchLabel[] }]));
  const rootLabels: TNestedSearchLabel[] = [];

  for (const label of labels) {
    const node = labelsMap.get(label.id)!;
    const parentRelations = label.labels.filter((lbl) => lbl.type === "subconcept_of");

    if (parentRelations.length === 0) {
      rootLabels.push(node);
    } else {
      let addedToParent = false;

      for (const parentRelation of parentRelations) {
        const parent = labelsMap.get(parentRelation.value.id);

        if (parent) {
          parent.children.push(node);
          addedToParent = true;
        }
      }

      if (!addedToParent) rootLabels.push(node);
    }
  }

  return rootLabels;
};

const getLabelPathSignature = (labelPath: TFilterPathLabel[]) => labelPath.map((label) => label.id).join("/");

interface IProps {
  labels: TSearchLabel[];
  onFiltersChange: (group: TSearchQueryGroup) => void;
}

export const CategorySpecificFilters = ({ labels, onFiltersChange }: IProps) => {
  const [checkedLabelPaths, setCheckedLabelPaths] = useState<TFilterPathLabel[][]>([]);

  const labelsToDisplay = sortBy(
    nestSearchLabels(labels).filter((rootLabel) => rootLabel.type === "category"),
    "id"
  );

  const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
    setCheckedLabelPaths((existingCheckedLabelPaths) => {
      const updatedCheckedLabelPaths = checked
        ? [...existingCheckedLabelPaths, labelPath]
        : existingCheckedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath));

      onFiltersChange(updatedCheckedLabelPaths.length > 0 ? buildFilterGroup(updatedCheckedLabelPaths) : null);
      return updatedCheckedLabelPaths;
    });
  };

  return (
    <FiltersContext value={{ checkedLabelPaths, toggleFilter }}>
      <div className="col-start-1 -col-end-1">
        <div className="max-w-125 p-8 border border-black rounded-lg">
          <SearchFilterLevel ancestorPath={[]} labels={labelsToDisplay} />
        </div>
      </div>
    </FiltersContext>
  );
};
