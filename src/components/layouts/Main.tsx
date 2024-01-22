import React, { FC, ReactNode } from "react";
import Head from "next/head";
import getPageTitle from "@utils/getPageTitle";

import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import getPageDescription from "@utils/getPageDescription";

const { default: Wrapper } = await import(`/themes/${process.env.THEME}/layouts/main`);

type TProps = {
  title?: string;
  description?: string;
  heading?: string;
  children?: ReactNode;
};

const Layout: FC<TProps> = ({ children, title = "", description = null }) => {
  const theme = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
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
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default Layout;
