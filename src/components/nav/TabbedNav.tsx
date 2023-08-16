import { useState, useEffect } from "react";
import TabbedNavItem from "./TabbedNavItem";

interface TabbedNavProps {
  handleTabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number): void;
  items: string[];
  activeIndex: number;
  showBorder?: boolean;
  indent?: boolean;
}

const TabbedNav = ({ handleTabClick, items, activeIndex = 0, showBorder = true, indent = true }: TabbedNavProps) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  useEffect(() => {
    setActiveTab(activeIndex);
  }, [activeIndex]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    setActiveTab(index);
    handleTabClick(e, index);
  };

  return (
    <div className={`grid grid-cols-2 pb-2 ${showBorder && "border-b"} md:grid-cols-none md:flex`} data-cy="tabbed-nav">
      {items.map((item, index) => (
        <TabbedNavItem
          key={`tab${index}`}
          title={item}
          index={index}
          activeTab={activeTab}
          onClick={(e) => {
            onClick(e, index);
          }}
          indent={indent}
        />
      ))}
    </div>
  );
};
export default TabbedNav;
