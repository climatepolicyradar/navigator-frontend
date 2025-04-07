import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemeConfig } from "@/types";
import { getAppTitle } from "@/utils/getAppTitle";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

const Wrapper = dynamic<{ children: ReactNode }>(() => import(`/themes/${process.env.THEME}/layouts/main`));

type TProps = {
  title?: string;
  theme?: TTheme;
  description?: string;
  themeConfig?: TThemeConfig;
  metadataKey?: string;
  text?: string;
  children?: ReactNode;
};

const Layout: FC<TProps> = ({ children, title, theme, description, themeConfig, metadataKey, text }) => {
  const router = useRouter();
  const contextTheme = useContext(ThemeContext);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
