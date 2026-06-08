import { Checkbox } from "@/components/atoms/checkbox/Checkbox";

import { TNestedSearchLabel, TSearchLabel } from "./filterData.stub";

type TFilterPathLabel = Omit<TSearchLabel, "labels">;

const nestSearchLabels = (labels: TSearchLabel[]): TNestedSearchLabel[] => {
  const labelsMap = new Map<string, TNestedSearchLabel>(labels.map((label) => [label.id, { ...label, children: [] as TNestedSearchLabel[] }]));
  const rootLabels: TNestedSearchLabel[] = [];

  for (const label of labels) {
    const node = labelsMap.get(label.id)!;
    const parentRelation = label.labels.find((lbl) => lbl.type === "subconcept_of");

    if (parentRelation) {
      const parent = labelsMap.get(parentRelation.value.id);

      if (parent) {
        parent.children.push(node);
      } else {
        rootLabels.push(node);
      }
    } else {
      rootLabels.push(node);
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

  return (
    <li>
      <Checkbox label={label.value} onCheckedChange={(checked) => onFilterToggle([filterPathLabel, ...ancestorPath], checked)} className="my-2" />
      {label.children.length > 0 && (
        <ul className="ml-8">
          {label.children.map((child) => (
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
  const nested = nestSearchLabels(labels);

  return (
    <div className="col-start-1 -col-end-1">
      <ul className="ml-8">
        {nested.map((label) => (
          <NestedLabel key={label.id} label={label} onFilterToggle={onFilterToggle} ancestorPath={[]} />
        ))}
      </ul>
    </div>
  );
};
