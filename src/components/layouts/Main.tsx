import React, { FC, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@context/ThemeContext";

import getAppName from "@utils/getAppName";
import getPageDescription from "@utils/getPageDescription";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

const { default: Wrapper } = await import(`/themes/${process.env.THEME}/layouts/main`);

type TProps = {
  title?: string;
  appName?: string;
  description?: string;
  heading?: string;
  children?: ReactNode;
};

const Layout: FC<TProps> = ({ children, title = "", appName = null, description = null }) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
      <Head>
        <title>{`${title} - ${getAppName(appName)}`}</title>
        <meta property="og:title" content={`${title} - ${getAppName(appName)}`} />
        <meta name="description" content={description ?? getPageDescription(description)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(description)} />
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
