import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { MENU_LINKS } from "@/mcf/constants/menuLinks";

const MCFLogo = (
  <LinkWithQuery href={`/`} className="flex items-center flex-nowrap gap-1" cypress="climate-project-explorer-logo">
    <Image src="/images/climate-project-explorer/cpe-logo.svg" alt="Climate Project Explorer" width={104.56} height={44} />
  </LinkWithQuery>
);

export const Header = () => {
  const router = useRouter();

  const showSearch = router.pathname !== "/";
  const showBorder = router.pathname !== "/";

  return (
    <NavBar
      headerClasses={`bg-surface-light min-h-20 ${showBorder ? "border-b border-gray-300 border-solid" : ""}`}
      logo={MCFLogo}
      menu={<MainMenu icon={<LucideMenu size={24} className="text-gray-950" />} links={MENU_LINKS} />}
      showSearch={showSearch}
    />
  );
};
