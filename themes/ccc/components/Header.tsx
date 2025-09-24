import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Menu } from "@/ccc/components/Menu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { joinTailwindClasses } from "@/utils/tailwind";

export const CCCLogo = (
  <Link href="/" data-cy="ccc-logo" className="max-w-full">
    <Image src="/images/ccc/ccc-logo-white.png" alt="The Climate Litigation Database" width={280} height={26} />
  </Link>
);

const Header = () => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";
  const isNotHome = router.pathname !== "/";

  const headerClasses = joinTailwindClasses("min-h-12 bg-surface-light", !showLogo && !showSearch && "!h-[72px]", isNotHome && "!bg-[#677787]");

  return <NavBar headerClasses={headerClasses} logo={CCCLogo} menu={<Menu />} showLogo={showLogo} showSearch={showSearch} />;
};

export default Header;
