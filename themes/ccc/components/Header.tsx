import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";

import { MENU_LINKS } from "@/ccc/constants/menuLinks";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { FeaturesContext } from "@/context/FeaturesContext";
import { joinTailwindClasses } from "@/utils/tailwind";

const CCCLogo = (
  <PageLink href="/" data-cy="ccc-logo" className="max-w-full">
    <Image src="/images/ccc/ccc-logo-white.png" alt="The Climate Litigation Database" width={280} height={26} />
  </PageLink>
);

export const Header = () => {
  const router = useRouter();
  const features = useContext(FeaturesContext);

  const showLogo = router.pathname !== "/";
  const showSearch = !features["new-search"] && !["/", "/_search"].includes(router.pathname);
  const isNotHome = router.pathname !== "/";

  const headerClasses = joinTailwindClasses("bg-white", isNotHome && "!bg-[#677787]");
  const menuIconClasses = router.pathname === "/" ? "text-gray-950" : "text-white";

  return (
    <NavBar
      headerClasses={headerClasses}
      logo={CCCLogo}
      menu={<MainMenu icon={<LucideMenu size={24} className={menuIconClasses} />} links={MENU_LINKS} />}
      showLogo={showLogo}
      showSearch={showSearch}
    />
  );
};
