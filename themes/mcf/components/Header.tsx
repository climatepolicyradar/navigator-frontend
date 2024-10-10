import { useRouter } from "next/router";

import { SiteWidth } from "@components/panels/SiteWidth";

import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";

import { Menu } from "./HeaderComponents/Menu";
import { Logo } from "./HeaderComponents/Logo";

const NON_SEARCH_PAGES = ["/", "/search"];

const Header = ({ background = true }) => {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className="w-full">
      <SiteWidth>
        <div className="flex flex-nowrap my-2">
          <div className="items-center flex flex-nowrap flex-1">
            <LinkWithQuery href={`/`} className="flex items-center flex-nowrap gap-1" cypress="climate-project-explorer-logo">
              <Logo />
            </LinkWithQuery>
            {showSearch && (
              <div className="hidden ml-6 md:block md:w-[340px]">
                <FloatingSearch />
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
