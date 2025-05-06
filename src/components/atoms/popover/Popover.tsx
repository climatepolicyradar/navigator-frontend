import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { ReactElement, ReactNode } from "react";

interface PopoverProps {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  openOnHover?: boolean;
  popupClasses?: string;
  trigger: ReactElement;
}

export const Popover = ({ children, onOpenChange, openOnHover = false, popupClasses = "", trigger }: PopoverProps) => (
  <BasePopover.Root openOnHover={openOnHover} onOpenChangeComplete={onOpenChange}>
    <BasePopover.Trigger render={trigger} />
    <BasePopover.Portal>
      <BasePopover.Positioner positionMethod="fixed" sideOffset={8}>
        <BasePopover.Popup
          className={`p-3 max-w-[350px] bg-surface-light border border-border-light rounded-md shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] text-sm leading-normal select-none ${popupClasses}`}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  </BasePopover.Root>
);
