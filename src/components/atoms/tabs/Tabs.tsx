import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

export type TTabsTab<TabId extends string> = {
  id: TabId;
  label: ReactNode;
  count?: number;
  panel?: ReactNode;
};

interface IProps<TabId extends string> {
  className?: string;
  onValueChange: (value: TabId) => void;
  panelClassName?: string;
  tabs: TTabsTab<TabId>[];
  value: TabId;
}

export const Tabs = <TabId extends string>({ className, onValueChange, panelClassName, tabs, value }: IProps<TabId>) => {
  const allHeaderClasses = joinTailwindClasses("border-b border-border-light", className);

  return (
    <BaseTabs.Root value={value} onValueChange={(newValue) => onValueChange(newValue as TabId)}>
      <div className={allHeaderClasses}>
        <BaseTabs.List className="flex gap-1 pl-8 -mb-px">
          {tabs.map(({ id, label, count }) => (
            <BaseTabs.Tab
              key={id}
              value={id}
              className="flex items-center justify-center gap-2 rounded-t-lg border border-transparent px-6 py-4 text-lg text-text-tertiary hocus:text-text-primary data-active:border-border-light data-active:border-b-bg-primary data-active:bg-bg-primary data-active:font-heavy data-active:text-text-primary"
            >
              {label}
              {typeof count === "number" && (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-inky-blue text-xs text-text-inverse font-heavy">
                  {count}
                </span>
              )}
            </BaseTabs.Tab>
          ))}
        </BaseTabs.List>
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
