import { Tooltip as BaseTooltip } from "@base-ui/react";
import { ReactNode } from "react";

import { BaseUIArrow } from "@/utils/baseUI";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  arrow?: boolean;
  children: ReactNode;
  content: string | ReactNode;
  popupClasses?: string;
  triggerClasses?: string;
  side?: "top" | "bottom";
}

export const Tooltip = ({ arrow = false, children, content, popupClasses, side = "top", triggerClasses }: IProps) => {
  const allPopupClasses = joinTailwindClasses(
    "px-1.5 py-1 bg-gray-950 rounded-md text-xs text-white text-nowrap leading-none font-medium",
    popupClasses
  );

  const arrowClasses = joinTailwindClasses("flex", side === "top" ? "-bottom-2 rotate-180" : "-top-2");

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger className={triggerClasses}>{children}</BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={arrow ? 7 : 2}>
            <BaseTooltip.Popup className={allPopupClasses}>
              {arrow && (
                <BaseTooltip.Arrow className={arrowClasses}>
                  <BaseUIArrow fill="fill-surface-mono-dark" stroke="fill-surface-mono-dark" />
                </BaseTooltip.Arrow>
              )}
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};
