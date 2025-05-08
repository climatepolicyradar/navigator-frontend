import { Menu } from "@/ccc/components/Menu";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import Image from "next/image";
import { useRouter } from "next/router";

export const CCLWLogo = (
  <LinkWithQuery href={`/`} cypress="cclw-logo">
    <span className="text-text-light text-2xl font-medium">Climate Case Chart</span>
  </LinkWithQuery>
);

const Header = () => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";

  return (
    <NavBar
      headerClasses={`min-h-12 bg-[rebeccapurple] ${!showLogo && !showSearch ? "!h-[72px]" : ""}`}
      logo={CCLWLogo}
      menu={<Menu />}
      showLogo={showLogo}
      showSearch={showSearch}
    />
  );
};

export default Header;
