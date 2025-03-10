import { useRouter } from "next/router";

import { FloatingSearch } from "@/components/FloatingSearch";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { SiteWidth } from "@/components/panels/SiteWidth";

import { Logo } from "./HeaderComponents/Logo";
import { Menu } from "./HeaderComponents/Menu";

const NON_SEARCH_PAGES = ["/", "/search"];

const Header = ({ background = true, showBottomBorder = true }) => {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className={`w-full py-2 ${showBottomBorder ? "border-b border-gray-200 border-solid" : ""}`}>
      <SiteWidth>
        <div className="flex flex-nowrap my-2">
          <div className="items-center flex flex-nowrap flex-1">
            <LinkWithQuery href={`/`} className="flex items-center flex-nowrap gap-1" cypress="climate-project-explorer-logo">
              <Logo />
            </LinkWithQuery>
            {showSearch && (
              <div className="hidden md:block m-auto">
                <FloatingSearch
                  extended={false}
                  placeholder={"Full text of over 5,000 multilateral climate fund projects"}
                  extraButtonClasses={"!hover:bg-mcf-blue"}
                />
              </div>
            )}
          </div>
          <div className="flex text-sm items-center">
            <Menu />
          </div>
        </div>
      </SiteWidth>
    </header>
  );
};

export default Header;
