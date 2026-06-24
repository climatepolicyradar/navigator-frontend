import { useState } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFiltersGroup } from "@/types";

interface IProps {
  filterGroup: TFiltersGroup;
}

export const CategorySpecificFilters = ({ filterGroup }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { Icon, title, nestedLabels } = filterGroup;

  return (
    <>
      <button
        type="button"
        className="flex gap-2 items-center px-3 py-2 text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full"
        onClick={() => setIsOpen((current) => !current)}
      >
        {Icon && <Icon size={16} className="text-elem-icon" />}
        <span>{title}</span>
      </button>
      <Drawer direction="left" open={isOpen} onOpenChange={(open) => setIsOpen(open)} title={title}>
        <AppliedFilters />
        <SearchFilterLevel ancestorPath={[]} labels={nestedLabels} />
      </Drawer>
    </>
  );
};
