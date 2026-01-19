import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemeConfig, TThemePageMetadataKey } from "@/types";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

interface IProps {
  title?: string;
  theme?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: TThemePageMetadataKey;
  text?: string;
  children?: ReactNode;
}

const Layout = ({ children, title, theme, description, themeConfig, metadataKey, text }: IProps) => {
  const router = useRouter();
  const { themeConfig: contextThemeConfig } = useContext(ThemeContext);

  const themeConfigToUse = themeConfig ?? contextThemeConfig;
  const appTitle = themeConfigToUse.pageMetadata.default.title || "";

  return (
    <>
      <Head>
        <title>{`${title ?? getPageTitle(themeConfigToUse, metadataKey, text)} - ${appTitle}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfigToUse, metadataKey, text)} - ${appTitle}`} />
        <meta name="description" content={description ?? getPageDescription(themeConfigToUse, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfigToUse, metadataKey, text)} />
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
