import { useState } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFiltersGroup } from "@/types";

interface IProps {
  filterGroup: TFiltersGroup;
}

export const SearchFiltersDrawer = ({ filterGroup }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (filterGroup.container !== "drawer") return null;
  const { Icon, nestedLabels, subtitle, title } = filterGroup;

  return (
    <>
      <button
        type="button"
        className="flex gap-2 items-center px-3 py-2 bg-bg-primary text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full"
        onClick={() => setIsOpen((current) => !current)}
      >
        {Icon && <Icon size={16} className="text-elem-icon" />}
        <span>{title}</span>
      </button>
      <Drawer
        direction="left"
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        title={
          <>
            <span>{title}</span>
            {subtitle && <span className="block mt-3 text-base text-text-secondary font-normal leading-6">{subtitle}</span>}
          </>
        }
      >
        <SearchFilterLevel ancestorPath={[]} labels={nestedLabels} inDrawer />
      </Drawer>
    </>
  );
};
