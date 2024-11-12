import React, { FC, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@context/ThemeContext";

import getAppName from "@utils/getAppName";
import getPageDescription from "@utils/getPageDescription";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

import { TTheme, TThemeConfig } from "@types";
import { getPageTitle } from "@utils/getPageTitle";

const { default: Wrapper } = await import(`/themes/${process.env.THEME}/layouts/main`);

type TProps = {
  title?: string;
  appName?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: string;
  children?: ReactNode;
};

const Layout: FC<TProps> = ({ children, title, appName, description, themeConfig, metadataKey }) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig, metadataKey)} - ${getAppName(appName)}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfig, metadataKey)} - ${getAppName(appName)}`} />
        <meta name="description" content={description ?? getPageDescription(appName, themeConfig, metadataKey)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(appName, themeConfig, metadataKey)} />
        <link rel="canonical" href={getCanonicalUrl(router, theme)} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default Layout;
