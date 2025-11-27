import { ToolTipSSR } from "@/components/tooltip/TooltipSSR";
import { getCategoryTooltip } from "@/helpers/getCategoryTooltip";

import { Button } from "../atoms/button/Button";

interface IProps {
  title: string;
  count?: number;
  index: number;
  activeTab: number;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string): void;
}

const TabbedNavItem = ({ title, count, index, activeTab, onClick }: IProps) => {
  const tooltipId = `${index}-tooltip`;
  const tooltipText = getCategoryTooltip(title);
  const isActive = activeTab === index;

  return (
    <>
      <Button
        color={isActive ? "brand" : "mono"}
        size="small"
        rounded
        variant={isActive ? "solid" : "faded"}
        onClick={(e) => onClick(e, title)}
        data-tooltip-content={tooltipText}
        data-tooltip-id={tooltipId}
        data-cy="tabbed-nav-item"
      >
        <span className={`font-[600] mr-1 ${isActive ? "text-white" : "text-text-primary"}`}>{title}</span>
        {typeof count !== "undefined" && <span className={`${isActive ? "text-white" : "text-text-secondary"}`}>{count}</span>}
      </Button>
      {tooltipText !== "" && <ToolTipSSR id={tooltipId} place={"top"} />}
    </>
  );
};
export default TabbedNavItem;
