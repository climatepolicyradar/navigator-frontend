import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { MENU_LINKS } from "@/cpr/constants/menuLinks";
import { joinTailwindClasses } from "@/utils/tailwind";

export const CPRLogo = (
  <LinkWithQuery href="/">
    <Image src="/images/cpr-logo-horizontal-new.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
  </LinkWithQuery>
);

export const CPRMenuButton = (
  <div className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-950 font-medium group-data-[popup-open]:bg-gray-100">
    <LucideMenu size={16} className="text-brand" /> Menu
  </div>
);

interface IProps {
  landingPage?: boolean;
}

export const Header = ({ landingPage = false }: IProps) => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/" && !landingPage;

  const navBarClasses = joinTailwindClasses(router.pathname === "/" && "!absolute top-0", landingPage && "!static");

  const menuIcon = router.pathname !== "/" ? CPRMenuButton : undefined;

  return (
    <NavBar
      headerClasses={navBarClasses}
      logo={CPRLogo}
      menu={<MainMenu icon={menuIcon} links={MENU_LINKS} />}
      showLogo={showLogo}
      showSearch={showSearch}
    />
  );
};
