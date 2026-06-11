import { Accordion } from "@base-ui/react/accordion";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import startCase from "lodash/startCase";
import { useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
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

type TNestedLabelProps = {
  label: TNestedSearchLabel;
  onFilterToggle: (group: TFilterPathLabel[], checked: boolean) => void;
  ancestorPath: TFilterPathLabel[];
};

const NestedLabel = ({ label, onFilterToggle, ancestorPath }: TNestedLabelProps) => {
  const filterPathLabel: TFilterPathLabel = {
    id: label.id,
    type: label.type,
    value: label.value,
  };

  const sortedChildren = sortBy(label.children, "id");
  const pathLabels = [filterPathLabel, ...ancestorPath];
  const onCheckedChange = (value: boolean | "indeterminate") => onFilterToggle(pathLabels, value === true);

  if (sortedChildren.length === 0) {
    return (
      <li className="pl-1 border-l">
        <Checkbox label={label.id} onCheckedChange={onCheckedChange} className="inline-flex py-1" />
      </li>
    );
  }

  const groups = Object.entries(groupBy(sortedChildren, "type"));

  return (
    <li className="pl-1 border-l">
      <Checkbox label={label.id} onCheckedChange={onCheckedChange} className="inline-flex py-1" />
      {groups.length === 1 ? (
        <ul className="ml-8">
          {sortedChildren.map((child) => (
            <NestedLabel key={child.id} label={child} onFilterToggle={onFilterToggle} ancestorPath={pathLabels} />
          ))}
        </ul>
      ) : (
        <Accordion.Root multiple className="ml-12 border-l">
          {groups.map(([type, children]) => (
            <Accordion.Item key={type} value={type}>
              <Accordion.Header>
                <Accordion.Trigger>{startCase(type)}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <ul className="ml-8">
                  {children.map((child) => (
                    <NestedLabel key={child.id} label={child} onFilterToggle={onFilterToggle} ancestorPath={pathLabels} />
                  ))}
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </li>
  );
};

interface IProps {
  labels: TSearchLabel[];
  onFiltersChange: (group: TSearchQueryGroup) => void;
}

const getPathLabelsSignature = (pathLabels: TFilterPathLabel[]) => pathLabels.map((label) => label.id).join("/");

export const CategorySpecificFilters = ({ labels, onFiltersChange }: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_pathLabels, setPathLabels] = useState<TFilterPathLabel[][]>([]);

  const labelsToDisplay = sortBy(
    nestSearchLabels(labels).filter((rootLabel) => rootLabel.type === "category"),
    "id"
  );

  const onFilterToggle = (pathLabels: TFilterPathLabel[], checked: boolean) => {
    setPathLabels((existingPathLabels) => {
      const updatedPathLabels = checked
        ? [...existingPathLabels, pathLabels]
        : existingPathLabels.filter((labels) => getPathLabelsSignature(labels) !== getPathLabelsSignature(pathLabels));

      onFiltersChange(updatedPathLabels.length > 0 ? buildFilterGroup(updatedPathLabels) : null);
      return updatedPathLabels;
    });
  };

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
