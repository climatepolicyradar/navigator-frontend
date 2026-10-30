import { Drawer as BaseDrawer, DrawerRootProps } from "@base-ui/react/drawer";
import { LucideX } from "lucide-react";
import { createContext, ReactNode, useContext } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

import styles from "./Drawer.module.css";

// Ensure PostHog measures scroll depth against the tabbed content, not the drawer or the non-drawer page content
export const DRAWER_SCROLL_ROOT_SELECTOR = "[data-drawer-scroll]:not([data-nested-drawer-open] *)";

// Whether the scroll area of a selfScrolling drawer should be marked as the scroll root
const TrackScrollContext = createContext(false);

type TDrawerScrollAreaProps = {
  children?: ReactNode;
  className?: string;
};

export const DrawerScrollArea = ({ children, className }: TDrawerScrollAreaProps) => {
  const isTrackingScroll = useContext(TrackScrollContext);

  return (
    <div
      data-drawer-scroll={isTrackingScroll ? "" : undefined}
      data-base-ui-swipe-ignore
      className={joinTailwindClasses("overflow-y-auto", className)}
    >
      {children}
    </div>
  );
};

const SWIPE_DIRECTION_MAP: Record<TDirection, "left" | "right" | "up" | "down"> = {
  left: "left",
  right: "right",
  top: "up",
  bottom: "down",
};

type TDirection = "left" | "right" | "top" | "bottom";

type TProps = Omit<DrawerRootProps, "swipeDirection"> & {
  children?: ReactNode;
  childrenClassName?: string;
  title?: ReactNode;
  titleExtras?: ReactNode;
  direction?: TDirection;
  selfScrolling?: boolean; // Children manage their own scrolling instead of the drawer
  /** Marks this drawer's content as the root PostHog measures scroll depth against while it is open */
  trackScroll?: boolean;
  wide?: boolean;
};

export const Drawer = ({
  children,
  childrenClassName,
  title,
  titleExtras,
  direction = "right",
  selfScrolling,
  trackScroll,
  wide,
  ...rootProps
}: TProps) => {
  const isTrackingScroll = !!trackScroll && !!rootProps.open;

  return (
    <BaseDrawer.Root {...rootProps} swipeDirection={SWIPE_DIRECTION_MAP[direction]}>
      <BaseDrawer.Portal>
        <div onClick={(event) => event.stopPropagation()}>
          <BaseDrawer.Backdrop className="fixed inset-0 bg-inky-black duration-200 [--backdrop-opacity:0.2] min-h-dvh opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <BaseDrawer.Viewport className={styles.DrawerViewport} data-direction={direction}>
            <BaseDrawer.Popup className={joinTailwindClasses(styles.DrawerContent, wide && styles.DrawerContentWide)} data-direction={direction}>
              <div className="flex items-start justify-between pt-6 px-4 pb-0 md:pt-7 md:px-8">
                {!!title && (
                  <BaseDrawer.Title className="text-xl text-text-primary font-semibold flex-1" data-base-ui-swipe-ignore>
                    {title}
                  </BaseDrawer.Title>
                )}
                <div data-base-ui-swipe-ignore className="flex items-center shrink-0 gap-2 md:gap-4">
                  {titleExtras}
                  <BaseDrawer.Close className="text-neutral-500 hover:text-neutral-800 justify-end">
                    <LucideX width={20} height={20} />
                  </BaseDrawer.Close>
                </div>
              </div>
              <div
                data-drawer-scroll={isTrackingScroll && !selfScrolling ? "" : undefined}
                data-base-ui-swipe-ignore
                className={joinTailwindClasses(
                  selfScrolling ? "flex-1 min-h-0 flex flex-col" : "overflow-y-auto px-4 pb-8 md:px-8",
                  childrenClassName
                )}
              >
                <TrackScrollContext.Provider value={isTrackingScroll}>{children}</TrackScrollContext.Provider>
              </div>
            </BaseDrawer.Popup>
          </BaseDrawer.Viewport>
        </div>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
