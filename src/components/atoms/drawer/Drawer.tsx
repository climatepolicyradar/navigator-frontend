import { Drawer as BaseDrawer, DrawerRootProps } from "@base-ui/react/drawer";
import { LucideX } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

import styles from "./Drawer.module.css";

type TDirection = "left" | "right" | "top" | "bottom";

type TProps = Omit<DrawerRootProps, "swipeDirection"> & {
  children?: React.ReactNode;
  childrenClassName?: string;
  title?: React.ReactNode;
  titleExtras?: React.ReactNode;
  direction?: TDirection;
};

const swipeDirectionMap: Record<TDirection, "left" | "right" | "up" | "down"> = {
  left: "left",
  right: "right",
  top: "up",
  bottom: "down",
};

export const Drawer = ({ children, childrenClassName, title, titleExtras, direction = "right", ...rootProps }: TProps) => {
  return (
    <BaseDrawer.Root {...rootProps} swipeDirection={swipeDirectionMap[direction]}>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 bg-inky-black duration-200 [--backdrop-opacity:0.2] min-h-dvh opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDrawer.Viewport className={styles.DrawerViewport} data-direction={direction}>
          <BaseDrawer.Popup className={styles.DrawerContent} data-direction={direction}>
            <div className="flex items-start justify-between p-7 pb-0">
              {!!title && (
                <BaseDrawer.Title className="text-xl font-semibold flex-1" data-base-ui-swipe-ignore>
                  {title}
                </BaseDrawer.Title>
              )}
              <div data-base-ui-swipe-ignore className="flex items-center gap-4 shrink-0">
                {titleExtras}
                <BaseDrawer.Close className="text-neutral-500 hover:text-neutral-800 justify-end">
                  <LucideX width={20} height={20} />
                </BaseDrawer.Close>
              </div>
            </div>
            <div data-base-ui-swipe-ignore className={joinTailwindClasses("overflow-y-auto p-7 pt-0", childrenClassName)}>
              {children}
            </div>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
