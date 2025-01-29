import Image from "next/image";

import { SiteWidth } from "@components/panels/SiteWidth";

import MainMenu from "@components/menus/MainMenu";
import { LinkWithQuery } from "@components/LinkWithQuery";

export function Header() {
  return (
    <header data-cy="header" className="w-full py-5 bg-white">
      <SiteWidth>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LinkWithQuery href="/">
              <Image src="/images/cpr-logo-horizontal-dark.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
            </LinkWithQuery>
          </div>
          <div className="flex items-center justify-end text-textDark">
            <div>
              <MainMenu iconClass="text-textDark" />
            </div>
          </div>
        </div>
      </SiteWidth>
    </header>
  );
}
