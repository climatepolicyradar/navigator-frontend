import { useRouter } from "next/router";
import Image from "next/image";

import { FullWidth } from "@components/panels/FullWidth";

import MainMenu from "../menus/MainMenu";
import Button from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FloatingSearch } from "@components/FloatingSearch";

const NON_SEARCH_PAGES = ["/", "/search"];

export function PageHeader() {
  const router = useRouter();

  // Do not show search on specific pages
  const showSearch = !NON_SEARCH_PAGES.includes(router.pathname);

  return (
    <header data-cy="header" className="w-full py-global banner">
      <FullWidth>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LinkWithQuery href="/">
              <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
            </LinkWithQuery>
            {showSearch && (
              <div className="hidden ml-2 lg:block md:w-[260px] lg:w-[340px]">
                <FloatingSearch />
              </div>
            )}
          </div>
          <div className="flex items-center justify-end">
            <div className="hidden md:block mr-6">
              <Button onClick={() => window.open("https://gst1.org")} extraClasses="rounded-full" thin>
                Global Stocktake Explorer
              </Button>
            </div>
            <div>
              <MainMenu />
            </div>
          </div>
        </div>
      </FullWidth>
    </header>
  );
}
