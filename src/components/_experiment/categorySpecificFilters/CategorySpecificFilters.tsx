import sortBy from "lodash/sortBy";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { TNestedSearchLabel, TSearchLabel } from "@/types";

type TFilterPathLabel = Omit<TSearchLabel, "labels">;

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

type TNestedLabelProps = {
  label: TNestedSearchLabel;
  onFilterToggle: (path: TFilterPathLabel[], checked: boolean | "indeterminate") => void;
  ancestorPath: TFilterPathLabel[];
};

const NestedLabel = ({ label, onFilterToggle, ancestorPath }: TNestedLabelProps) => {
  const filterPathLabel: TFilterPathLabel = {
    id: label.id,
    type: label.type,
    value: label.value,
  };

  const sortedChildren = sortBy(label.children, "id");

  return (
    <li className="pl-1 border-l">
      <Checkbox label={label.id} onCheckedChange={(checked) => onFilterToggle([filterPathLabel, ...ancestorPath], checked)} className="py-1" />
      {sortedChildren.length > 0 && (
        <ul className="ml-8">
          {sortedChildren.map((child) => (
            <NestedLabel key={child.id} label={child} onFilterToggle={onFilterToggle} ancestorPath={[filterPathLabel, ...ancestorPath]} />
          ))}
        </ul>
      )}
    </li>
  );
};

interface IProps {
  labels: TSearchLabel[];
  onFilterToggle: (path: TFilterPathLabel[], checked: boolean | "indeterminate") => void;
}

export const CategorySpecificFilters = ({ labels, onFilterToggle }: IProps) => {
  const labelsToDisplay = sortBy(
    nestSearchLabels(labels).filter((rootLabel) => rootLabel.type === "category"),
    "id"
  );

  return (
    <div className="col-start-1 -col-end-1">
      <ul className="ml-8">
        {labelsToDisplay.map((label) => (
          <NestedLabel key={label.id} label={label} onFilterToggle={onFilterToggle} ancestorPath={[]} />
        ))}
      </ul>
    </div>
  );
};
