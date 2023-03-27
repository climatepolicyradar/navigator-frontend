import React, { FC, ReactNode } from "react";
import Head from "next/head";
import CPRMain from "@cpr/layouts/main";
import CCLWMain from "@cclw/layouts/main";
import getPageTitle from "@utils/getPageTitle";

import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import getPageDescription from "@utils/getPageDescription";

type TProps = {
  title?: string;
  description?: string;
  heading?: string;
  screenHeight?: boolean;
  children?: ReactNode;
};

const Layout: FC<TProps> = ({ children, title = "", description = null, screenHeight = false }) => {
  const theme = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
      <Head>
        <title>{`${title} | ${getPageTitle(theme)}`}</title>
        <meta property="og:title" content={`${title} | ${getPageTitle(theme)}`} />
        <meta name="description" content={description ?? getPageDescription(theme)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(theme)} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      {theme === "cpr" && <CPRMain screenHeight={screenHeight}>{children}</CPRMain>}
      {theme === "cclw" && <CCLWMain>{children}</CCLWMain>}
    </div>
  );
};

export default Layout;
