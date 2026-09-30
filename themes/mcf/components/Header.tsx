import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { FeaturesContext } from "@/context/FeaturesContext";
import { MENU_LINKS } from "@/mcf/constants/menuLinks";

const MCFLogo = (
  <PageLink href="/" data-cy="climate-project-explorer-logo" className="flex items-center flex-nowrap gap-1">
    <Image src="/images/climate-project-explorer/cpe-logo.svg" alt="Climate Project Explorer" width={104.56} height={44} />
  </PageLink>
);

export const Header = () => {
  const router = useRouter();
  const features = useContext(FeaturesContext);

  const isHomePage = router.pathname === "/";
  const showSearch = router.pathname !== "/_search" && !features["new-search"] && !isHomePage;

  return (
    <NavBar
      headerClasses={`bg-white min-h-20 ${!isHomePage ? "border-b border-gray-300 border-solid" : ""}`}
      logo={MCFLogo}
      menu={<MainMenu icon={<LucideMenu size={24} className="text-gray-950" />} links={MENU_LINKS} />}
      showSearch={showSearch}
    />
  );
};
