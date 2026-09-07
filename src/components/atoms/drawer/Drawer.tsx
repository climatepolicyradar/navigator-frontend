import { Drawer as BaseDrawer, DrawerRootProps } from "@base-ui/react/drawer";
import { LucideX } from "lucide-react";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

import styles from "./Drawer.module.css";

type TDirection = "left" | "right" | "top" | "bottom";

type TProps = Omit<DrawerRootProps, "swipeDirection"> & {
  children?: ReactNode;
  childrenClassName?: string;
  title?: ReactNode;
  titleExtras?: ReactNode;
  direction?: TDirection;
  /** Marks this drawer's content as the root PostHog measures scroll depth against while it is open */
  trackScroll?: boolean;
  wide?: boolean;
};

const swipeDirectionMap: Record<TDirection, "left" | "right" | "up" | "down"> = {
  left: "left",
  right: "right",
  top: "up",
  bottom: "down",
};

/**
 * PostHog measures scroll depth against the first element matching its `scroll_root_selector`, so
 * when drawers are nested only the innermost open one may be marked.
 *
 * Tracked drawers tell their nearest tracked ancestor when they open, so the ancestor can stand
 * down while they are on top. This only reaches drawers rendered inside one another, which is how
 * every nested drawer works today (a principal drawer renders the document and topic drawers).
 *
 * Opted into per drawer: swapping the scroll root mid-page-view mixes two elements into one
 * measurement, so only drawers that open on a URL change - and so start their own page view - mark
 * themselves. `trackScroll` therefore needs the controlled `open` prop.
 */
type TScrollRootContext = {
  onNestedOpen: () => void;
  onNestedClose: () => void;
};

const ScrollRootContext = createContext<TScrollRootContext | null>(null);

export const Drawer = ({ children, childrenClassName, title, titleExtras, direction = "right", trackScroll, wide, ...rootProps }: TProps) => {
  const trackedAncestor = useContext(ScrollRootContext);
  const [openNestedCount, setOpenNestedCount] = useState(0);

  const scrollRootContext = useMemo(
    () => ({
      onNestedOpen: () => setOpenNestedCount((count) => count + 1),
      onNestedClose: () => setOpenNestedCount((count) => count - 1),
    }),
    []
  );

  const isTracking = !!trackScroll && !!rootProps.open;

  useEffect(() => {
    if (!isTracking || !trackedAncestor) return;

    trackedAncestor.onNestedOpen();
    return trackedAncestor.onNestedClose;
  }, [isTracking, trackedAncestor]);

  return (
    <BaseDrawer.Root {...rootProps} swipeDirection={swipeDirectionMap[direction]}>
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 bg-inky-black duration-200 [--backdrop-opacity:0.2] min-h-dvh opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDrawer.Viewport className={styles.DrawerViewport} data-direction={direction}>
          <BaseDrawer.Popup className={joinTailwindClasses(styles.DrawerContent, wide && styles.DrawerContentWide)} data-direction={direction}>
            <div className="flex items-start justify-between pt-7 px-8 pb-0">
              {!!title && (
                <BaseDrawer.Title className="text-xl text-text-primary font-semibold flex-1" data-base-ui-swipe-ignore>
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
            <div
              data-drawer-scroll={isTracking && openNestedCount === 0 ? "" : undefined}
              data-base-ui-swipe-ignore
              className={joinTailwindClasses("overflow-y-auto px-8 pb-8", childrenClassName)}
            >
              <ScrollRootContext.Provider value={isTracking ? scrollRootContext : trackedAncestor}>{children}</ScrollRootContext.Provider>
            </div>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
};
