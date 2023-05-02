import React, { ReactNode, useContext } from "react";
import Head from "next/head";
import { ThemeContext } from "@context/ThemeContext";
import getPageTitle from "@utils/getPageTitle";
import getPageDescription from "@utils/getPageDescription";

type TProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

const Layout = ({ children, title = "", description = null }: TProps) => {
  const theme = useContext(ThemeContext);

  return (
    <div>
      <Head>
        <title>{`${title} - ${getPageTitle(theme)}`}</title>
        <meta property="og:title" content={`${title} - ${getPageTitle(theme)}`} />
        <meta name="description" content={description ?? getPageDescription(theme)} key="desc" />
        <meta property="og:description" content={description ?? getPageDescription(theme)} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      {children}
    </div>
  );
};

export default Layout;
