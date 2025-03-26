import { Menu } from "@/cclw/components/Menu";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import Image from "next/image";
import { useRouter } from "next/router";

export const CCLWLogo = (
  <LinkWithQuery href={`/`} cypress="cclw-logo">
    <div className="flex items-center flex-nowrap gap-2">
      <Image src="/images/cclw/cclw-logo-globe.png" alt="Climate Change Laws of the World logo globe" width={60} height={60} />
      <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={197} height={30} />
    </div>
  </LinkWithQuery>
);

const Header = () => {
  const router = useRouter();

  const showBackground = router.pathname === "/";
  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";

  return (
    <NavBar
      headerClasses={`min-h-12 ${showBackground ? "bg-cclw-dark" : ""}`}
      logo={CCLWLogo}
      menu={<Menu />}
      showLogo={showLogo}
      showSearch={showSearch}
    />
  );
};

export default Header;
