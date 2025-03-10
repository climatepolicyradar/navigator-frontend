import { ToolTipSSR } from "@/components/tooltip/TooltipSSR";
import { getCategoryTooltip } from "@/helpers/getCategoryTooltip";
import { TDocumentCategory } from "@/types";

interface TabbedNavItemProps {
  title: TDocumentCategory;
  count?: number;
  index: number;
  activeTab: number;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string): void;
}

const tabCount = (count: number, active: boolean) => {
  return <span className={`py-1 px-2 rounded-2xl text-xs bg-gray-100 ${active && "text-blue-600 bg-blue-100"}`}>{count}</span>;
};

const TabbedNavItem = ({ title, count, index, activeTab, onClick }: TabbedNavItemProps) => {
  const tooltipId = `${index}-tooltip`;
  const tooltipText = getCategoryTooltip(title);
  const isActive = activeTab === index;
  const cssClass = `flex items-center gap-2 text-textDark text-left mt-4 text-sm transition hover:text-blue-600 md:px-4 md:mt-0 ${
    isActive && "tabbed-nav__active"
  } ${index === 0 && "md:pl-3"}`;

  return (
    <>
      <button
        onClick={(e) => onClick(e, title)}
        className={cssClass}
        data-tooltip-content={tooltipText}
        data-tooltip-id={tooltipId}
        data-cy="tabbed-nav-item"
      >
        {title} {count && tabCount(count, isActive)}
      </button>
      {tooltipText !== "" && <ToolTipSSR id={tooltipId} place={"top"} />}
    </>
  );
};
export default TabbedNavItem;
