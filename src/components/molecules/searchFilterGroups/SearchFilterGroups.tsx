import { Accordion } from "@base-ui/react/accordion";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import { ChevronDown } from "lucide-react";

import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getLabelDisplay } from "@/utils/filters/getLabelDisplay";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  labels: TNestedSearchLabel[];
  level: number;
}

export const SearchFilterGroups = ({ ancestorPath, labels, level }: IProps) => {
  const groups = sortBy(Object.entries(groupBy(labels, "type")), "0");

  const defaultValue = level === 2 ? groups.map(([type]) => type) : undefined;

  return (
    <Accordion.Root multiple defaultValue={defaultValue} className="flex flex-col gap-5">
      {groups.map(([type, typeLabels]) => {
        const labelType = getLabelDisplay(typeLabels[0], ancestorPath).type;

        return (
          <Accordion.Item key={type} value={type} className="group">
            <Accordion.Header>
              <Accordion.Trigger className="flex items-center justify-start gap-1">
                <span className="text-sm text-text-primary font-medium leading-5">{labelType}</span>
                <ChevronDown size={16} className="text-elem-icon shrink-0 group-data-open:rotate-180 transition duration-300" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="mt-3">
              <SearchFilterLevel ancestorPath={ancestorPath} labels={typeLabels} level={level + 1} />
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};
