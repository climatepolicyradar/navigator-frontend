import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";

import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TFiltersGroup } from "@/types";

interface IProps {
  filterGroup: TFiltersGroup;
}

export const SearchFiltersPopover = ({ filterGroup }: IProps) => {
  const { nestedLabels, title } = filterGroup;

  return (
    <BasePopover.Root>
      <BasePopover.Trigger className="flex gap-2 items-center px-3 py-2 bg-bg-primary data-popup-open:bg-bg-flat text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full">
        <span>{title}</span>
        <ChevronDown size={16} className="text-elem-icon" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" side="bottom" sideOffset={8} align="start" className="">
          <BasePopover.Popup className="w-83 max-h-[calc(100dvh-12px)] px-6 py-5 bg-bg-primary border border-border-normal rounded-xl shadow-2xl overflow-y-auto">
            <SearchFilterLevel ancestorPath={[]} labels={nestedLabels} />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
