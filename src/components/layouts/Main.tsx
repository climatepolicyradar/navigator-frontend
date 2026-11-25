import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactNode, useContext } from "react";

import { Wrapper } from "@/components/Themed";
import { ThemeContext } from "@/context/ThemeContext";
import { TTheme, TThemePageMetadataKey } from "@/types";
import { getCanonicalUrl } from "@/utils/getCanonicalUrl";
import { getPageDescription } from "@/utils/getPageDescription";
import { getPageTitle } from "@/utils/getPageTitle";

interface IProps {
  title?: string;
  description?: string;
  metadataKey?: TThemePageMetadataKey;
  text?: string;
  theme?: TTheme;
  children?: ReactNode;
  canonicalUrl?: string;
}

const Layout: FC<IProps> = ({ children, title, description, metadataKey, text, canonicalUrl, theme }) => {
  const router = useRouter();
  const { themeConfig } = useContext(ThemeContext);

  const appTitle = themeConfig.pageMetadata.default.title || "";

  return (
    <div className="h-full min-h-lvh flex flex-col">
      <Head>
        <title>{`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${appTitle}`}</title>
        <meta property="og:title" content={`${title ?? getPageTitle(themeConfig, metadataKey, text)} - ${appTitle}`} />
        <meta name="description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(themeConfig, metadataKey, text)} />
        <link rel="canonical" href={canonicalUrl ?? getCanonicalUrl(router, theme)} />
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
