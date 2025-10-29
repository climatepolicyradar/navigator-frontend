import Image from "next/image";
import { useRouter } from "next/router";

import { MENU_LINKS } from "@/cclw/constants/menuLinks";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";

const CCLWLogo = (
  <LinkWithQuery href={`/`} cypress="cclw-logo">
    <div className="max-h-[56px] flex items-center flex-nowrap gap-2">
      <Image src="/images/cclw/cclw-logo-globe.png" alt="Climate Change Laws of the World logo globe" width={60} height={60} />
      <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={197} height={30} />
    </div>
  </LinkWithQuery>
);

export const Header = () => {
  const router = useRouter();

  const showLogo = router.pathname !== "/";
  const showSearch = router.pathname !== "/";

  return <NavBar headerClasses="bg-cclw-dark" logo={CCLWLogo} menu={<MainMenu links={MENU_LINKS} />} showLogo={showLogo} showSearch={showSearch} />;
};
