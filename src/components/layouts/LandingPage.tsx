import React, { ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@context/ThemeContext";

import getAppName from "@utils/getAppName";
import getPageDescription from "@utils/getPageDescription";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

import { TTheme } from "@types";

type TProps = {
  children?: ReactNode;
  title?: string;
  appName?: TTheme;
  description?: string;
};

const Layout = ({ children, title = "", appName, description }: TProps) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <>
      <Head>
        <title>{`${title} - ${getAppName(appName)}`}</title>
        <meta property="og:title" content={`${title} - ${getAppName(appName)}`} />
        <meta name="description" content={description ?? getPageDescription(appName)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(appName)} />
        <link rel="canonical" href={getCanonicalUrl(router, theme)} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      {children}
    </>
  );
};

export default Layout;
