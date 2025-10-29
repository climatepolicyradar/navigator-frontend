import { ReactNode } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
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
    "sticky top-0 z-60 w-full cols5-4:h-[72px] flex flex-col justify-center",
    showSearch ? "h-[128px]" : "h-[72px]",
    headerClasses
  );
  const allColumnClasses = joinTailwindClasses(showLogo && showSearch && "grid-rows-2 cols5-4:grid-rows-[initial]");

  return (
    <header data-cy="header" className={allHeaderClasses}>
      <FiveColumns
        className={allColumnClasses}
        columnOverrides={["grid-cols-[1fr_auto]", "cols5-2:grid-cols-[1fr_auto]", "cols5-3:grid-cols-[1fr_auto]"]}
      >
        {showLogo && <div className="flex items-center col-start-1 -col-end-1 cols5-3:col-end-3">{logo}</div>}
        {showSearch && (
          <div className="cols5-4:col-start-3 cols5-4:-col-end-2 cols5-5:-col-end-3">
            <NavSearch />
          </div>
        )}
        <div className="flex items-center justify-end -col-end-1">{menu}</div>
      </FiveColumns>
    </header>
  );
};
