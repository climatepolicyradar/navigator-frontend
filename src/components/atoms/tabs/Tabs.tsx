import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

export type TTabsTab<TabId extends string> = {
  id: TabId;
  label: ReactNode;
  count?: number;
  panel?: ReactNode;
  banner?: ReactNode;
};

type TTabsAnalytics = {
  context?: string;
};

interface IProps<TabId extends string> {
  analytics?: TTabsAnalytics;
  className?: string;
  onValueChange: (value: TabId) => void;
  panelClassName?: string;
  sticky?: boolean;
  tabs: TTabsTab<TabId>[];
  tabsContainer?: (tabsList: ReactNode) => ReactNode;
  value: TabId;
}

export const Tabs = <TabId extends string>({
  analytics,
  className,
  onValueChange,
  panelClassName,
  sticky,
  tabs,
  tabsContainer,
  value,
}: IProps<TabId>) => {
  const allHeaderClasses = joinTailwindClasses(sticky && "sticky z-10 bg-bg-primary", className);

  const bannerTab = tabs.find((tab) => !!tab.banner && tab.id !== value);

  const tabsList = (
    <BaseTabs.List className="flex gap-1 -mb-px">
      {tabs.map(({ id, label, count }) => (
        <BaseTabs.Tab
          key={id}
          value={id}
          data-ph-capture-attribute-tab={id}
          data-ph-capture-attribute-tab-context={analytics?.context}
          className="relative flex items-center justify-center gap-2 rounded-t-lg border border-transparent py-2 px-2 md:px-6 md:py-4 text-lg text-text-tertiary hocus:text-text-primary data-active:border-border-light data-active:border-b-bg-primary data-active:bg-bg-primary data-active:font-heavy data-active:text-text-primary"
        >
          {label}
          {typeof count === "number" && (
            <span className="flex h-6 min-w-6 px-1 shrink-0 items-center justify-center rounded-full bg-inky-blue text-xs text-text-inverse font-heavy">
              {count}
            </span>
          )}
          {bannerTab?.id === id && (
            <svg aria-hidden viewBox="0 0 32 16" className="absolute -bottom-px left-1/2 -translate-x-1/2 h-2 w-4 md:h-4 md:w-8 overflow-visible">
              <polygon points="0,16 16,0 32,16" className="fill-bg-attention" />
              <polyline points="0,16 16,0 32,16" fill="none" vectorEffect="non-scaling-stroke" className="stroke-border-light" />
            </svg>
          )}
        </BaseTabs.Tab>
      ))}
    </BaseTabs.List>
  );

  return (
    <BaseTabs.Root value={value} onValueChange={(newValue) => onValueChange(newValue as TabId)}>
      <div className={allHeaderClasses}>
        <div className="border-b border-border-light">{tabsContainer ? tabsContainer(tabsList) : tabsList}</div>
        {bannerTab && <div className="bg-bg-brand text-text-inverse">{bannerTab.banner}</div>}
      </div>
      {tabs.map(
        ({ id, panel }) =>
          panel !== undefined && (
            <BaseTabs.Panel key={id} value={id} className={panelClassName}>
              {panel}
            </BaseTabs.Panel>
          )
      )}
    </BaseTabs.Root>
  );
};
