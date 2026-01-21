import { Fragment, ReactNode } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { ToggleGroup, TToggleGroupToggle } from "@/components/molecules/toggleGroup/ToggleGroup";
import { IMetadata } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IPageHeaderGenericProps {
  dark?: boolean;
  label?: string;
  title: ReactNode;
}

interface IPageHeaderMetadataProps extends IPageHeaderGenericProps {
  metadata: IMetadata[];
  tabs?: never;
  currentTab?: never;
  onTabChange?: never;
}

interface IPageHeaderTabsProps<TabId extends string> extends IPageHeaderGenericProps {
  metadata?: never;
  tabs: TToggleGroupToggle<TabId>[];
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

type TProps<TabId extends string = string> = IPageHeaderMetadataProps | IPageHeaderTabsProps<TabId>;

export const PageHeader = <TabId extends string>({
  currentTab,
  dark = false,
  label,
  metadata = [],
  onTabChange,
  tabs = [],
  title,
}: TProps<TabId>) => {
  const hasTabs = tabs.length > 0;
  const containerClasses = joinTailwindClasses("pt-9", hasTabs ? "pb-6" : "pb-12", dark && "mb-8 bg-gray-100");

  return (
    <div className={containerClasses}>
      <FiveColumns verticalGap>
        <div className="col-span-2">{label && <h2 className="text-3xl text-gray-500 leading-9 font-heavy">{label}</h2>}</div>
        <div className="col-start-1 cols-4:col-start-3 -col-end-1 cols-5:col-end-9 flex flex-col gap-6">
          {/* Title */}

          <h1 className="text-3xl text-gray-950 leading-9 font-heavy">{title}</h1>

          {/* Metadata */}
          {metadata.length > 0 && (
            <div className="grid grid-cols-[min-content_auto] gap-x-8 gap-y-2 text-sm">
              {metadata.map((property, index) => (
                <Fragment key={index}>
                  <div className="text-gray-950 font-medium whitespace-nowrap">{property.label}</div>
                  <div className="text-gray-700">{property.value}</div>
                </Fragment>
              ))}
            </div>
          )}

          {/* Tabs */}
          {hasTabs && <ToggleGroup<TabId> toggles={tabs} value={currentTab} onValueChange={onTabChange} buttonSize="large" />}
        </div>
      </FiveColumns>
    </div>
  );
};
