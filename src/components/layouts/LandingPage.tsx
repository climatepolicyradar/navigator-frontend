import React, { ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@context/ThemeContext";

import getAppName from "@utils/getAppName";
import { getPageDescription } from "@utils/getPageDescription";
import { getPageTitle } from "@utils/getPageTitle";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

import { TTheme, TThemeConfig } from "@types";

type TProps = {
  title?: string;
  appName?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: string;
  text?: string;
  children?: ReactNode;
};

const Layout = ({ children, title, appName, description, themeConfig, metadataKey, text }: TProps) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <>
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${getAppName(appName)}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${getAppName(appName)}`} />
        <meta name="description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} />
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
