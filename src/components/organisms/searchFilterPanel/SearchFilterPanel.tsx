import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FilterPopover } from "@/components/_experiment/searchFilters/FilterPopover";
import { Drawer } from "@/components/atoms/drawer/Drawer";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFiltersGroup } from "@/types";

interface IProps {
  filterGroup: TFiltersGroup;
}

export const SearchFilterPanel = ({ filterGroup }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { container, Icon, title, nestedLabels } = filterGroup;

  return (
    <>
      {/* Button */}
      <button
        type="button"
        className="flex gap-2 items-center px-3 py-2 text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full"
        onClick={() => setIsOpen((current) => !current)}
      >
        {container === "drawer" && Icon && <Icon size={16} className="text-elem-icon" />}
        <span>{title}</span>
        {container === "popover" && <ChevronDown size={16} className="text-elem-icon" />}
      </button>
      {/* Filters */}
      {container === "drawer" ? (
        <Drawer direction="left" open={isOpen} onOpenChange={(open) => setIsOpen(open)} title={title}>
          <SearchFilterLevel ancestorPath={[]} labels={nestedLabels} />
        </Drawer>
      ) : (
        <FilterPopover>
          <SearchFilterLevel ancestorPath={[]} labels={nestedLabels} />
        </FilterPopover>
      )}
    </>
  );
};
