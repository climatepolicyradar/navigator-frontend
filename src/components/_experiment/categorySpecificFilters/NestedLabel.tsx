import { Accordion } from "@base-ui/react/accordion";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import startCase from "lodash/startCase";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

type IProps = {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
  onFilterToggle: (group: TFilterPathLabel[], checked: boolean) => void;
};

export const NestedLabel = ({ label, onFilterToggle, ancestorPath }: IProps) => {
  const filterPathLabel: TFilterPathLabel = {
    id: label.id,
    type: label.type,
    value: label.value,
  };
  const pathLabels = [filterPathLabel, ...ancestorPath];

  const sortedChildren = sortBy(label.children, "id");
  const groups = Object.entries(groupBy(sortedChildren, "type"));

  const onCheckedChange = (value: boolean | "indeterminate") => onFilterToggle(pathLabels, value === true);

  if (sortedChildren.length === 0) {
    return (
      <li className="pl-1 border-l">
        <Checkbox label={label.id} onCheckedChange={onCheckedChange} className="inline-flex py-1" />
      </li>
    );
  }

  return (
    <li className="pl-1 border-l">
      <Checkbox label={label.id} onCheckedChange={onCheckedChange} className="inline-flex py-1" />
      {sortedChildren.length > 0 && groups.length === 1 ? (
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
