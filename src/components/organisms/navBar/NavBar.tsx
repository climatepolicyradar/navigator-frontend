import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
import { NavSearch } from "@/components/molecules/navSearch/NavSearch";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  headerClasses?: string;
  logo: ReactNode;
  menu: ReactNode;
  showLogo?: boolean;
  showSearch?: boolean;
}

export const NavBar = ({ headerClasses = "", logo, menu, showLogo = true, showSearch = true }: IProps) => {
  const allHeaderClasses = joinTailwindClasses(
    "w-full cols-3:h-[72px] sticky top-0 z-60",
    showLogo || showSearch ? "h-[128px]" : "h-[72px]",
    headerClasses
  );
  const mainContainerClasses = joinTailwindClasses(
    "-ml-2 flex gap-2 cols-2:col-span-2 cols-3:gap-6 cols-4:gap-0 cols-4:col-span-3 cols-4:grid cols-4:grid-cols-subgrid",
    showSearch ? "justify-between" : "justify-end"
  );
  const searchContainerClasses = joinTailwindClasses("flex-1 cols-4:col-span-2", !showSearch && "hidden cols-3:block");
  const logoContainerClasses = joinTailwindClasses(
    "h-[54px] pt-2 cols-3:pt-0 items-center cols-2:col-span-2 cols-3:col-span-1",
    showLogo ? "flex" : "hidden cols-3:flex"
  );

  return (
    <header data-cy="header" className={allHeaderClasses}>
      <Columns containerClasses="h-full" gridClasses="h-full items-center gap-y-1">
        <div className={logoContainerClasses}>{showLogo && logo}</div>
        <div className={mainContainerClasses}>
          <div className={searchContainerClasses}>{showSearch && <NavSearch />}</div>
          <div className="flex items-center justify-self-end">{menu}</div>
        </div>
      </Columns>
    </header>
  );
};
