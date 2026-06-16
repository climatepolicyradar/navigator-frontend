import { Accordion } from "@base-ui/react/accordion";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import startCase from "lodash/startCase";
import { ChevronDown } from "lucide-react";

import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  labels: TNestedSearchLabel[];
}

export const SearchFilterGroups = ({ ancestorPath, labels }: IProps) => {
  const groups = sortBy(Object.entries(groupBy(labels, "type")), "0");

  return (
    <Accordion.Root multiple className="flex flex-col gap-5">
      {groups.map(([type, typeLabels]) => (
        <Accordion.Item key={type} value={type} className="group">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-start gap-1">
              <span className="text-sm text-text-primary font-medium leading-5">{startCase(type)}</span>
              <ChevronDown size={16} className="text-elem-icon shrink-0 group-data-open:rotate-180 transition duration-300" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="mt-3">
            <SearchFilterLevel ancestorPath={ancestorPath} labels={typeLabels} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
