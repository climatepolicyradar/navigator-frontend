import Image from "next/image";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import Footer from "@/components/footer/Footer";
import MainMenu from "@/components/menus/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";

export const CPRLogo = (
  <LinkWithQuery href="/">
    <Image src="/images/cpr-logo-horizontal-new.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
  </LinkWithQuery>
);

export const navBarGradient = (
  <div className="sticky top-[128px] cols-3:top-[72px] -z-10 h-0">
    <div className="h-30 bg-linear-to-b from-gray-50 to-white" />
  </div>
);

interface IProps {
  children?: ReactNode;
}

const Main: FC<IProps> = ({ children }) => {
  const router = useRouter();

  const showGradient = router.pathname !== "/";

  return (
    <>
      <NavBar logo={CPRLogo} menu={<MainMenu />} />
      {showGradient && navBarGradient}
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default Main;
