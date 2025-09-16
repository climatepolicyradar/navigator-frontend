import { useRouter } from "next/router";

import { Menu } from "@/ccc/components/Menu";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { joinTailwindClasses } from "@/utils/tailwind";

export const CCCLogo = (
  <LinkWithQuery href={`/`} cypress="ccc-logo">
    <span className="text-text-primary text-2xl font-medium">The Climate Litigation Database</span>
  </LinkWithQuery>
);

const Header = () => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";
  const showBorder = router.pathname !== "/";

  const headerClasses = joinTailwindClasses(
    "min-h-12 bg-surface-light",
    !showLogo && !showSearch && "!h-[72px]",
    showBorder && "border-b border-gray-200 border-solid"
  );

  return <NavBar headerClasses={headerClasses} logo={CCCLogo} menu={<Menu />} showLogo={showLogo} showSearch={showSearch} />;
};

export default Header;
