import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
import { Toggle } from "@/components/molecules/toggleGroup/Toggle";
import { ToggleGroup } from "@/components/molecules/toggleGroup/ToggleGroup";
import { IMetadata } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

interface IPageHeaderGenericProps {
  dark?: boolean;
  title: ReactNode;
}

interface IPageHeaderMetadataProps extends IPageHeaderGenericProps {
  metadata: IMetadata[];
  tabs?: never;
  currentTab?: never;
  onTabChange?: never;
}

export interface IPageHeaderTab<Tab extends string> {
  tab: Tab;
  label?: string;
}

export interface IPageHeaderTabsProps<Tab extends string> extends IPageHeaderGenericProps {
  metadata?: never;
  tabs: IPageHeaderTab<Tab>[];
  currentTab: Tab;
  onTabChange: (tab: string) => void;
}

type TProps<Tab extends string = string> = IPageHeaderMetadataProps | IPageHeaderTabsProps<Tab>;

export const PageHeader = <Tab extends string>({ currentTab, dark = false, metadata = [], onTabChange, tabs = [], title }: TProps<Tab>) => {
  const onToggleChange = (toggleValue: string[]) => {
    onTabChange(toggleValue[0]);
  };

  const hasTabs = tabs.length > 0;

  const containerClasses = joinTailwindClasses(dark && "bg-gray-100");
  const contentClasses = joinTailwindClasses("cols-2:col-start-2 cols-3:col-end-4 flex flex-col gap-6 pt-9", hasTabs ? "pb-6" : "pb-12");

  return (
    <Columns containerClasses={containerClasses}>
      <div className={contentClasses}>
        {/* Title */}
        <h1 className="text-3xl text-gray-950 leading-9 font-heavy">{title}</h1>

        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="grid grid-cols-[min-content_auto] gap-x-8 gap-y-2 text-sm">
            {metadata.map((property) => (
              <>
                <div className="text-gray-950 font-medium whitespace-nowrap">{property.label}</div>
                <div className="text-gray-700">{property.value}</div>
              </>
            ))}
          </div>
        )}

        {/* Tabs */}
        {hasTabs && (
          <ToggleGroup value={[currentTab]} onValueChange={onToggleChange}>
            {tabs.map(({ label, tab }) => (
              <Toggle key={tab} value={tab} size="large">
                {label || firstCase(tab)}
              </Toggle>
            ))}
          </ToggleGroup>
        )}
      </div>
    </Columns>
  );
};
