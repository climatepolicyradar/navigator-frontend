import Footer from "@/components/footer/Footer";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import MainMenu from "@/components/menus/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import Image from "next/image";
import { FC, ReactNode } from "react";

export const CPRLogo = (
  <LinkWithQuery href="/">
    <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
  </LinkWithQuery>
);

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <NavBar headerClasses="banner" logo={CPRLogo} menu={<MainMenu />} />
    <div className="h-[calc(100vh-128px)] md:h-[calc(100vh-72px)] flex flex-col justify-between overflow-y-auto">
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  </>
);
export default Main;
