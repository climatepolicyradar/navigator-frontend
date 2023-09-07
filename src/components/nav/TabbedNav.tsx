import { useState, useEffect } from "react";
import TabbedNavItem from "./TabbedNavItem";
import { getCategoryTooltip } from "@helpers/getCategoryTooltip";

type TTabItems = {
  title: string;
  count?: number;
};

type TTabbedNavProps = {
  handleTabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: string): void;
  items: TTabItems[];
  activeIndex: number;
  showBorder?: boolean;
};

const TabbedNav = ({ handleTabClick, items, activeIndex = 0, showBorder = true }: TTabbedNavProps) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  const helpText = (index: number) => {
    return getCategoryTooltip(items[index].title);
  };

  useEffect(() => {
    setActiveTab(activeIndex);
  }, [activeIndex]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: string) => {
    setActiveTab(index);
    handleTabClick(e, index, value);
  };

  return (
    <>
      <div className={`grid grid-cols-2 pb-2 ${showBorder && "border-b"} md:grid-cols-none md:flex`} data-cy="tabbed-nav">
        {items.map((item, index) => (
          <TabbedNavItem
            key={`tab${index}`}
            title={item.title}
            count={item.count}
            index={index}
            activeTab={activeTab}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => onClick(e, index, value)}
          />
        ))}
      </div>
      {helpText(activeIndex) && <div className="pl-2 text-sm my-1 text-gray-600">{helpText(activeIndex)}</div>}
    </>
  );
};
export default TabbedNav;
