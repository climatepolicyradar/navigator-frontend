import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemeConfig, TThemePageMetadataKey } from "@/types";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

const Wrapper = dynamic<{ children: ReactNode }>(() => import(`../../../themes/${process.env.THEME}/layouts/main.tsx`));

interface IProps {
  title?: string;
  description?: string;
  metadataKey?: TThemePageMetadataKey;
  text?: string;
  theme?: TTheme;
  themeConfig?: TThemeConfig;
  children?: ReactNode;
  attributionUrl?: string | null;
}

const Layout: FC<IProps> = ({ children, title, description, metadataKey, text, attributionUrl, themeConfig, theme }) => {
  const router = useRouter();
  const { themeConfig: contextThemeConfig } = useContext(ThemeContext);

  const themeConfigToUse = themeConfig ?? contextThemeConfig;
  const appTitle = themeConfigToUse.pageMetadata.default.title || "";

  return (
    <div className="h-full min-h-lvh flex flex-col">
      <Head>
        <title>{`${title ?? getPageTitle(themeConfigToUse, metadataKey, text)} - ${appTitle}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfigToUse, metadataKey, text)} - ${appTitle}`} />
        <meta name="description" content={description ?? getPageDescription(themeConfigToUse, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfigToUse, metadataKey, text)} />
        <link rel="canonical" href={getCanonicalUrl(router, theme, attributionUrl)} />
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
