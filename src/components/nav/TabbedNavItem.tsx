interface TabbedNavItemProps {
  title: string;
  indent?: boolean;
  index: number;
  activeTab: number;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const TabbedNavItem = ({ title, index, activeTab, onClick, indent = true }: TabbedNavItemProps) => {
  const cssClass = `text-left mt-4 text-sm hover:text-blue-600 md:px-4 md:mt-0 ${activeTab === index && "tabbed-nav__active"} ${
    index === 0 && "md:pl-3"
  }`;
  return (
    <button onClick={onClick} className={cssClass}>
      {title}
    </button>
  );
};
export default TabbedNavItem;
