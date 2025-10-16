import Image from "next/image";
import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { NavBar } from "@/components/organisms/navBar/NavBar";

import { Menu } from "./Menu";

export const MCFLogo = (
  <LinkWithQuery href={`/`} className="flex items-center flex-nowrap gap-1" cypress="climate-project-explorer-logo">
    <Image src="/images/climate-project-explorer/cpe-logo.svg" alt="Climate Project Explorer" width={104.56} height={44} />
  </LinkWithQuery>
);

const Header = () => {
  const router = useRouter();

  const showSearch = router.pathname !== "/";
  const showBorder = router.pathname !== "/";

  return (
    <NavBar
      headerClasses={`bg-surface-light min-h-20 ${showBorder ? "border-b border-gray-300 border-solid" : ""}`}
      logo={MCFLogo}
      menu={<Menu />}
      showSearch={showSearch}
    />
  );
};

export default Header;
