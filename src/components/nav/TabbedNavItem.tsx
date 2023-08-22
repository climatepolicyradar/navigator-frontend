import { ToolTipSSR } from "@components/tooltip/TooltipSSR";
import { getCategoryTooltip } from "@helpers/getCategoryTooltip";

interface TabbedNavItemProps {
  title: string;
  index: number;
  activeTab: number;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const TabbedNavItem = ({ title, index, activeTab, onClick }: TabbedNavItemProps) => {
  const tooltipId = `${index}-tooltip`;
  const tooltipText = getCategoryTooltip(title);
  const cssClass = `text-left mt-4 text-sm hover:text-blue-600 md:px-4 md:mt-0 ${activeTab === index && "tabbed-nav__active"} ${
    index === 0 && "md:pl-3"
  }`;

  return (
    <>
      <button onClick={onClick} className={cssClass} data-tip={tooltipText} data-for={tooltipId} data-cy="tabbed-nav-item">
        {title}
      </button>
      {tooltipText !== "" && <ToolTipSSR id={tooltipId} place={"top"} />}
    </>
  );
};
export default TabbedNavItem;
