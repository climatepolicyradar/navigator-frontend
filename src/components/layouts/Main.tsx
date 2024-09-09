import React, { FC, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import getPageTitle from "@utils/getPageTitle";

import { ThemeContext } from "@context/ThemeContext";
import getPageDescription from "@utils/getPageDescription";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

const { default: Wrapper } = await import(`/themes/${process.env.THEME}/layouts/main`);

type TProps = {
  title?: string;
  description?: string;
  heading?: string;
  children?: ReactNode;
  canonical?: string;
};

const Layout: FC<TProps> = ({ children, title = "", description = null }) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
      <Head>
        <title>{`${title} - ${getPageTitle(theme)}`}</title>
        <meta property="og:title" content={`${title} - ${getPageTitle(theme)}`} />
        <meta name="description" content={description ?? getPageDescription(theme)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(theme)} />
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
