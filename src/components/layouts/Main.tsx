import React, { FC, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@/context/ThemeContext";

import { getAppTitle } from "@/utils/getAppTitle";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";

import { TTheme, TThemeConfig } from "@/types";
import dynamic from "next/dynamic";

const Wrapper = dynamic<{ children: ReactNode }>(() => import(`/themes/${process.env.THEME}/layouts/main`));

interface IProps {
  title?: string;
  theme?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: string;
  text?: string;
  children?: ReactNode;
}

const Layout: FC<IProps> = ({ children, title, theme, description, themeConfig, metadataKey, text }) => {
  const router = useRouter();
  const contextTheme = useContext(ThemeContext);

  return (
    <div className="h-full min-h-lvh flex flex-col">
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${getAppTitle(theme, contextTheme)}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${getAppTitle(theme, contextTheme)}`} />
        <meta name="description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} />
        <link rel="canonical" href={getCanonicalUrl(router, contextTheme)} />
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
