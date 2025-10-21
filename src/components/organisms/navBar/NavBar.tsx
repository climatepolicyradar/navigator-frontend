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
    "-ml-2 flex gap-2 cols-2:col-span-2",
    showSearch ? "justify-between" : "justify-end",
    showLogo || showSearch ? "cols-4:col-span-3" : "cols-3:col-span-3 cols-4:col-span-4"
  );

  return (
    <header data-cy="header" className={allHeaderClasses}>
      <Columns containerClasses="h-full" gridClasses="h-full items-center gap-y-1">
        {(showLogo || showSearch) && (
          <div className="h-[54px] pt-2 cols-3:pt-0 flex items-center cols-2:col-span-2 cols-3:col-span-1">{showLogo && logo}</div>
        )}
        <div className={mainContainerClasses}>
          {showSearch && <NavSearch />}
          {menu}
        </div>
      </Columns>
    </header>
  );
};
