import { Drawer as BaseDrawer, DrawerRootProps } from "@base-ui/react/drawer";
import { LucideX } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

import styles from "./DrawerNew.module.css";

type TProps = DrawerRootProps & {
  children?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
};

export const Drawer = ({ children, title, className, ...rootProps }: TProps) => {
  return (
    <BaseDrawer.Root {...rootProps}>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 bg-inky-black duration-200 [--backdrop-opacity:0.2] min-h-dvh opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 " />
        <BaseDrawer.Viewport className={joinTailwindClasses(styles.Viewport, className)}>
          <BaseDrawer.Popup className={joinTailwindClasses(styles.Popup, className)}>
            <div className="flex items-start justify-between">
              {!!title && <BaseDrawer.Title className="text-xl font-semibold flex-1 mr-4">{title}</BaseDrawer.Title>}
              <BaseDrawer.Close className="text-neutral-500 hover:text-neutral-800 shrink-0 justify-end">
                <LucideX width={20} height={20} />
              </BaseDrawer.Close>
            </div>
            {children}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
