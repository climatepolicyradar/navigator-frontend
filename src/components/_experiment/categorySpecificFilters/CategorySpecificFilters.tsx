import { Checkbox } from "@/components/atoms/checkbox/Checkbox";

import { TNestedSearchLabel, TSearchLabel } from "./filterData.stub";

interface IProps {
  labels: TSearchLabel[];
}

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

const NestedLabel = ({ label }: { label: TNestedSearchLabel }) => (
  <li>
    <Checkbox label={label.value} onCheckedChange={() => {}} className="my-2" />
    {label.children.length > 0 && (
      <ul className="ml-8">
        {label.children.map((child) => (
          <NestedLabel key={child.id} label={child} />
        ))}
      </ul>
    )}
  </li>
);

export const CategorySpecificFilters = ({ labels }: IProps) => {
  const nested = nestSearchLabels(labels);

  return (
    <div className="col-start-1 -col-end-1">
      <ul className="ml-8">
        {nested.map((label) => (
          <NestedLabel key={label.id} label={label} />
        ))}
      </ul>
    </div>
  );
};
