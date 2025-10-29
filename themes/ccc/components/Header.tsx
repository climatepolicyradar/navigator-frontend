import { LucideMenu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { MENU_LINKS } from "@/ccc/constants/menuLinks";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { joinTailwindClasses } from "@/utils/tailwind";

const CCCLogo = (
  <Link href="/" data-cy="ccc-logo" className="max-w-full">
    <Image src="/images/ccc/ccc-logo-white.png" alt="The Climate Litigation Database" width={280} height={26} />
  </Link>
);

export const Header = () => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";
  const isNotHome = router.pathname !== "/";

  const headerClasses = joinTailwindClasses("bg-surface-light", isNotHome && "!bg-[#677787]");
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
