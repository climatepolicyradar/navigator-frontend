import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

interface IPageHeaderGenericProps {
  coloured?: boolean;
  label: string;
  title: ReactNode;
}

export interface IPageHeaderMetadata {
  label: string;
  value: ReactNode;
}

interface IPageHeaderMetadataProps extends IPageHeaderGenericProps {
  metadata: IPageHeaderMetadata[];
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

export const PageHeader = <Tab extends string>({
  coloured = false,
  currentTab,
  label,
  metadata = [],
  onTabChange,
  tabs = [],
  title,
}: TProps<Tab>) => {
  const onTabClick = (clickedTab: string) => () => {
    onTabChange?.(clickedTab);
  };

  const containerClasses = joinTailwindClasses(
    "pt-8 cursor-default",
    coloured ? "bg-[#EDEFF1] text-text-primary" : "text-text-primary",
    !coloured && "border-b border-b-border-light"
  );

  const largeTextClasses = "text-[32px] leading-none font-bold";
  const tertiaryTextClasses = "text-text-tertiary";

  const labelClasses = joinTailwindClasses(largeTextClasses, tertiaryTextClasses);
  const titleClasses = joinTailwindClasses(
    largeTextClasses,
    "block pt-8 pb-12 cols-3:pt-0 cols-3:pb-24 cols-3:w-[80%] cols-2:col-span-2 cols-4:col-span-3"
  );

  return (
    <Columns containerClasses={containerClasses} gridClasses="gap-y-0">
      {/* Title */}
      <div className={labelClasses}>{label}</div>
      <h1 className={titleClasses}>{title}</h1>

      {/* Metadata */}
      {metadata.length > 0 && (
        <div className="pb-4 flex gap-8 col-start-1 cols-2:col-end-3 cols-3:col-start-2 cols-3:col-end-4 cols-4:col-end-5 text-sm leading-none">
          {metadata.map((property) => (
            <div key={property.label} className="flex flex-col gap-2.5">
              <div className={tertiaryTextClasses}>{property.label}</div>
              <div className="inline-block">{property.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-8 cols-3:col-start-2 cols-3:col-end-4 cols-4:col-end-5 text-[18px] leading-tight font-[660]">
          {tabs.map((tab) => {
            const tabIsActive = tab.tab === currentTab;
            const tabClasses = joinTailwindClasses(
              "pb-4 mb-[1px] border-b-[3px] hover:text-text-primary",
              !tabIsActive && `${tertiaryTextClasses} border-b-transparent`
            );

            return (
              <button key={tab.tab} type="button" onClick={onTabClick(tab.tab)} className={tabClasses}>
                {tab.label || firstCase(tab.tab)}
              </button>
            );
          })}
        </div>
      )}
    </Columns>
  );
};
