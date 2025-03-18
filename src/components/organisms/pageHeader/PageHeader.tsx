import Image from "next/image";
import { useRouter } from "next/router";

import { SiteWidth } from "@/components/panels/SiteWidth";
import MainMenu from "../../menus/MainMenu";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { FloatingSearch } from "@/components/FloatingSearch";

const NON_SEARCH_PAGES = ["/", "/search"];

export const PageHeader = () => {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className="w-full p-4 flex justify-between items-center banner">
      <div className="flex-1">
        <LinkWithQuery href="/">
          <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
        </LinkWithQuery>
      </div>
      <div className="flex-2 flex justify-center">
        {showSearch && (
          <div className="hidden lg:block md:w-[260px] lg:w-[340px]">
            <FloatingSearch />
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-end">
        <MainMenu />
      </div>
    </header>
  );
};
