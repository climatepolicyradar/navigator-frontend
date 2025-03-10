import Image from "next/image";
import { useRouter } from "next/router";

import { SiteWidth } from "@components/panels/SiteWidth";
import MainMenu from "../menus/MainMenu";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";

const NON_SEARCH_PAGES = ["/", "/search"];

export function PageHeader() {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className="w-full py-5 banner">
      <SiteWidth>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LinkWithQuery href="/">
              <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
            </LinkWithQuery>
            {showSearch && (
              <div className="hidden ml-12 lg:block md:w-[260px] lg:w-[340px]">
                <FloatingSearch />
              </div>
            )}
          </div>
          <div className="flex items-center justify-end">
            <div>
              <MainMenu />
            </div>
          </div>
        </div>
      </SiteWidth>
    </header>
  );
}
