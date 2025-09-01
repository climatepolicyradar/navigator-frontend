import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemeConfig } from "@/types";
import { getAppTitle } from "@/utils/getAppTitle";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

interface IProps {
  title?: string;
  theme?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: string;
  text?: string;
  children?: ReactNode;
}

const Layout = ({ children, title, theme, description, themeConfig, metadataKey, text }: IProps) => {
  const router = useRouter();
  const { themeConfig: contextThemeConfig } = useContext(ThemeContext);

  return (
    <>
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig ?? contextThemeConfig, metadataKey, text)} - ${getAppTitle(themeConfig ?? contextThemeConfig)}`}</title>
        <meta
          property="og:title"
          content={`${title ?? getPageTitle(themeConfig ?? contextThemeConfig, metadataKey, text)} - ${getAppTitle(themeConfig ?? contextThemeConfig)}`}
        />
        <meta name="description" content={description ?? getPageDescription(themeConfig ?? contextThemeConfig, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfig ?? contextThemeConfig, metadataKey, text)} />
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
