import { Fragment, ReactNode, useContext } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { NavSearch } from "@/components/molecules/navSearch/NavSearch";
import { FeaturesContext } from "@/context/FeaturesContext";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  headerClasses?: string;
  logo: ReactNode;
  menu: ReactNode;
  menuButtons?: ReactNode;
  showLogo?: boolean;
  showSearch?: boolean;
  topContent?: ReactNode[];
}

export const NavBar = ({ headerClasses = "", logo, menu, menuButtons, showLogo = true, showSearch = true, topContent }: IProps) => {
  const features = useContext(FeaturesContext);
  const newSearch = features["new-search"];

  const allHeaderClasses = joinTailwindClasses(
    "sticky top-0 z-60 w-full cols-4:min-h-[72px] flex flex-col justify-center",
    showSearch ? "min-h-[128px]" : "min-h-[72px]",
    headerClasses
  );
  const allColumnClasses = joinTailwindClasses("py-2", showLogo && showSearch && "grid-rows-2 cols-4:grid-rows-[initial]");

  return (
    <header data-cy="header" className={allHeaderClasses}>
      {topContent && topContent.length > 0 && (
        <>
          {topContent.map((content, index) => (
            <Fragment key={index}>{content}</Fragment>
          ))}
        </>
      )}
      <FiveColumns
        className={allColumnClasses}
        columnOverrides={["grid-cols-[1fr_auto]", "cols-2:grid-cols-[1fr_auto]", "cols-3:grid-cols-[1fr_auto]"]}
      >
        {showLogo && <div className="flex items-center col-start-1 -col-end-1 cols-3:col-end-3">{logo}</div>}
        {showSearch && !newSearch && (
          <div className="cols-4:col-start-3 cols-4:-col-end-2 cols-5:-col-end-3">
            <NavSearch />
          </div>
        )}
        <div className="flex items-center justify-end -col-end-1">{menuButtons ? menuButtons : menu}</div>
      </FiveColumns>
    </header>
  );
};
