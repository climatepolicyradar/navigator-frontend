import { useState, useEffect } from "react";

import { getCategoryTooltip } from "@/helpers/getCategoryTooltip";
import { TDocumentCategory } from "@/types";

import TabbedNavItem from "./TabbedNavItem";

type TTabItems = {
  title: string;
  count?: number;
};

interface IProps {
  handleTabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: string): void;
  items: TTabItems[];
  activeItem: string;
  showBorder?: boolean;
}

const TabbedNav = ({ handleTabClick, items, activeItem, showBorder = true }: IProps) => {
  const [activeTab, setActiveTab] = useState(items.findIndex((item) => item.title === activeItem));

  const helpText = (item: string) => {
    return getCategoryTooltip(items.find((i) => i.title === item) ? item : "All");
  };

  useEffect(() => {
    setActiveTab(items.findIndex((item) => item.title === activeItem));
  }, [items, activeItem]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: string) => {
    setActiveTab(items.findIndex((item) => item.title === value));
    handleTabClick(e, index, value);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2" data-cy="tabbed-nav">
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
      {helpText(activeItem) && <div className="text-sm my-2 text-text-tertiary">{helpText(activeItem)}</div>}
    </>
  );
};
export default TabbedNav;
