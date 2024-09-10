import React, { ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { ThemeContext } from "@context/ThemeContext";

import getPageTitle from "@utils/getPageTitle";
import getPageDescription from "@utils/getPageDescription";
import { getCanonicalUrl } from "@utils/getCanonicalUrl";

type TProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

const Layout = ({ children, title = "", description = null }: TProps) => {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  return (
    <>
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
      {children}
    </>
  );
};

export default Layout;
