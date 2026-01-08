import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useContext } from "react";

import { Wrapper } from "@/components/Themed";
import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemeConfig } from "@/types";
import { getAppTitle } from "@/utils/getAppTitle";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

interface IProps {
  title?: string;
  description?: string;
  metadataKey?: string;
  text?: string;
  theme?: TTheme;
  themeConfig?: TThemeConfig;
  children?: ReactNode;
  attributionUrl?: string | null;
}

const Layout: FC<IProps> = ({ children, title, description, metadataKey, text, attributionUrl, themeConfig, theme }) => {
  const router = useRouter();
  const { themeConfig: contextThemeConfig } = useContext(ThemeContext);

  return (
    <div className="h-full min-h-lvh flex flex-col">
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig ?? contextThemeConfig, metadataKey, text)} - ${getAppTitle(themeConfig ?? contextThemeConfig)}`}</title>
        <meta
          property="og:title"
          content={`${title ?? getPageTitle(themeConfig ?? contextThemeConfig, metadataKey, text)} - ${getAppTitle(themeConfig ?? contextThemeConfig)}`}
        />
        <meta name="description" content={description ?? getPageDescription(themeConfig ?? contextThemeConfig, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfig ?? contextThemeConfig, metadataKey, text)} />
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
