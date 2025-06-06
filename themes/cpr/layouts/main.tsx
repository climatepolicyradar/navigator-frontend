import Image from "next/image";
import { FC, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import Footer from "@/components/footer/Footer";
import MainMenu from "@/components/menus/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";

export const CPRLogo = (
  <LinkWithQuery href="/">
    <Image src="/images/cpr-logo-horizontal.png" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
  </LinkWithQuery>
);

interface IProps {
  children?: ReactNode;
}

const Main: FC<IProps> = ({ children }) => (
  <>
    <NavBar headerClasses="banner" logo={CPRLogo} menu={<MainMenu />} />
    <main className="flex flex-col flex-1">{children}</main>
    <Footer />
  </>
);
export default Main;
