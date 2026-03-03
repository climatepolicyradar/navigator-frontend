import { ReactNode } from "react";
import { Drawer as VaulDrawer, DialogProps as VaulDrawerRootProps } from "vaul";

import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = VaulDrawerRootProps & {
  children: ReactNode;
  direction?: "left" | "right";
  title: ReactNode;
  trigger?: ReactNode;
};

export const Drawer = ({ children, direction = "right", title, trigger, ...rootProps }: TProps) => {
  const contentClasses = joinTailwindClasses(
    "fixed top-0 bottom-0 left-4 cols-2:left-6 cols-3:left-[initial] h-full cols-3:w-150 p-8 bg-white outline-none overflow-x-hidden overflow-y-auto",
    direction === "right" ? "right-0 rounded-tl-xl rounded-bl-xl" : "left-0 rounded-tr-xl rounded-br-xl"
  );

  return (
    <VaulDrawer.Root direction={direction} {...rootProps}>
      {trigger && <VaulDrawer.Trigger>{trigger}</VaulDrawer.Trigger>}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className={contentClasses} role="dialog">
          <VaulDrawer.Title className="text-2xl text-gray-950 font-heavy leading-7 mb-6">{title}</VaulDrawer.Title>
          <VaulDrawer.Description asChild>
            <div>{children}</div>
          </VaulDrawer.Description>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
