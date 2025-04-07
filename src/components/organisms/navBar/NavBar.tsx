import { NavSearch } from "@/components/molecules/navSearch/NavSearch";

interface NavBarProps {
  headerClasses?: string;
  logo: React.ReactNode;
  menu: React.ReactNode;
  showLogo?: boolean;
  showSearch?: boolean;
}

export const NavBar = ({ headerClasses = "", logo, menu, showLogo = true, showSearch = true }: NavBarProps) => {
  return (
    <header data-cy="header" className={`w-full h-[128px] sm:h-[72px] ${headerClasses}`}>
      <div className="max-w-maxSiteWidth sm:px-4 pt-2 sm:pb-2 mx-auto flex justify-between items-center flex-wrap sm:flex-nowrap gap-y-1 sm:gap-y-0">
        {showLogo && <div className="lg:flex-1 shrink-4 md:max-w-[30%] px-4 sm:pl-0 sm:pt-0">{logo}</div>}
        {showSearch && (
          <div className="flex-[1_1_100%] sm:flex-initial order-1 sm:order-0 lg:min-w-[550px]">
            <NavSearch />
          </div>
        )}
        <div className="lg:flex-1 flex justify-end pt-4 pr-4 sm:pt-0 sm:pr-0">{menu}</div>
      </div>
    </header>
  );
};
