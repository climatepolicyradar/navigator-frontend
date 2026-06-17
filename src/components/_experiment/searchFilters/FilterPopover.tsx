import { Popover as BasePopover } from "@base-ui/react/popover";

import { joinTailwindClasses } from "@/utils/tailwind";

export const FilterPopover = ({ children }: { children: React.ReactNode }) => {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        align="start"
        className="h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none"
        positionMethod="fixed"
        side="bottom"
        sideOffset={8}
      >
        <BasePopover.Popup
          className={joinTailwindClasses(
            // base-ui
            "relative flex h-(--popup-height,auto) min-w-100 w-(--popup-width,auto) max-w-(--available-width) flex-col ",
            // animation
            "origin-(--transform-origin) transition-[width,height,opacity,scale] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:scale-100 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0",
            // cpr
            "rounded-xl border border-border-normal bg-white shadow-xl p-5 text-sm focus-visible:outline-none"
          )}
        >
          {/* manages the animation between different popover contents */}
          <BasePopover.Viewport
            className={`
                      relative h-full w-full
                      **:data-current:w-[calc(var(--popup-width)-1rem)]
                      **:data-current:translate-x-0
                      **:data-current:opacity-100
                      **:data-current:transition-[translate,opacity]
                      **:data-current:duration-[150ms,100ms]
                      **:data-current:ease-[cubic-bezier(0.22,1,0.36,1)]
                      data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
                      data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
                      data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
                      data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
                      **:data-previous:w-[calc(var(--popup-width)-1rem)]
                      **:data-previous:translate-x-0
                      **:data-previous:opacity-100
                      **:data-previous:transition-[translate,opacity]
                      **:data-previous:duration-[150ms,80ms]
                      **:data-previous:ease-[cubic-bezier(0.22,1,0.36,1)]
                      data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
                      data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
                      data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
                      data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0`}
          >
            {children}
          </BasePopover.Viewport>
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
};
