import { ReactNode } from "react";
import { Drawer as VaulDrawer } from "vaul";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  direction?: "left" | "right";
  trigger?: ReactNode;
}

/**
 * TODO
 * - Support for opening/closing manually without a trigger element
 * - Styling pass
 * - Mobile viewports & a11y pass
 * - Storybook stories
 */

export const Drawer = ({ children, direction = "right", trigger }: IProps) => {
  const contentClasses = joinTailwindClasses(
    "fixed top-0 right-0 bottom-0 h-full p-8 bg-white outline-none overflow-hidden",
    direction === "right" ? "rounded-tl-xl rounded-bl-xl" : "rounded-tr-xl rounded-br-xl"
  );

  return (
    <VaulDrawer.Root direction={direction}>
      {trigger && <VaulDrawer.Trigger>{trigger}</VaulDrawer.Trigger>}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className={contentClasses}>
          <div className="overflow-x-auto max-h-full">{children}</div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
