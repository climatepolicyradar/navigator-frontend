import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { MENU_LINKS } from "@/cpr/constants/menuLinks";
import { joinTailwindClasses } from "@/utils/tailwind";

export const CPRLogo = (
  <PageLink href="/" data-cy="cpr-logo">
    <Image src="/images/cpr-logo-horizontal-new.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
  </PageLink>
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

  const isHomepage = router.pathname === "/";
  const showSearch = router.pathname !== "/" && !landingPage;

  const navBarClasses = joinTailwindClasses(isHomepage ? "!absolute top-0" : "bg-white", landingPage && "!static");

  const menuIcon = router.pathname !== "/" ? CPRMenuButton : undefined;

  return (
    <NavBar
      headerClasses={navBarClasses}
      logo={CPRLogo}
      menu={<MainMenu icon={menuIcon} links={MENU_LINKS} />}
      showLogo={!isHomepage}
      showSearch={showSearch}
    />
  );
};
