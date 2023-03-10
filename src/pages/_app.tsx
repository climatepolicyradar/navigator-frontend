import "../../i18n";
import { useEffect, useState } from "react";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/flag-icon.css";
import "@cclw/styles/cclw.main.scss";

import { ThemeContext } from "@context/ThemeContext";
import { AdobeContext } from "@context/AdobeContext";

import { CookieConsent } from "@components/cookies/CookieConsent";
import { Banner } from "@cclw/components/Banner";

const queryClient = new QueryClient();

declare global {
  interface Window {
    Cypress: any;
    queryClient: any;
  }
}

function getThemeColours(theme: string): string {
  return theme === "cclw"
    ? `
    :root { 
      --color-lineBorder:#bfc2d9;
      --color-primary-400:#ED3D48;
      --color-primary-600:#ED3D48;
      --color-primary-700:#2B2F49;
      --color-indigo-400:#2B2F49;
      --color-indigo-500:#2B2F49;
      --color-indigo-600:#2B2F49;
      --color-indigo-700:#2B2F49;
      --color-sky:#fde1e3;
      --color-blue-100:#e8f3fe;
      --color-blue-200:#e2aeb2;
      --color-blue-300:#ED3D48;
      --color-blue-400:#ED3D48;
      --color-blue-500:#ED3D48;
      --color-blue-600:#ED3D48;
      --color-blue-700:#C9131E;
    }`
    : `
    :root { 
      --color-lineBorder:#d0e5fd;
      --color-primary-400:#1f93ff;
      --color-primary-600:#006FD6;
      --color-primary-700:#0A1C40;
      --color-indigo-400:#6E6E6E;
      --color-indigo-500:#616c85;
      --color-indigo-600:#071e4a;
      --color-indigo-700:#0A1C40;
      --color-sky:#ebf2ff;
      --color-blue-100:#e8f3fe;
      --color-blue-200:#d0e5fd;
      --color-blue-300:#a4cdfb;
      --color-blue-400:#7cb4fa;
      --color-blue-500:#1f93ff;
      --color-blue-600:#006FD6;
      --color-blue-700:#0A1C40;
    }`;
}

type TProps = AppProps & {
  theme?: string;
  adobeApiKey?: string;
};

function MyApp({ Component, pageProps, theme, adobeApiKey }: TProps) {
  const [siteTheme, setSiteTheme] = useState(null);
  const [adobeKey, setAdobeKey] = useState(null);

  useEffect(() => {
    // For access inside Cypress:
    if (window?.Cypress) {
      window.queryClient = queryClient;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme && theme !== "") {
      setSiteTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (adobeApiKey && adobeApiKey !== "") {
      setAdobeKey(adobeApiKey);
    }
  }, [adobeApiKey]);

  const dynamicTheme = theme ?? siteTheme;
  const dynamicAdobeKey = adobeApiKey ?? adobeKey;

  const favicon = dynamicTheme === "cclw" ? "/cclw/images/favicon.png" : "/favicon.png";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={dynamicTheme}>
        <AdobeContext.Provider value={dynamicAdobeKey}>
          <Head>
            <link rel="icon" href={favicon} />
            <style>{getThemeColours(dynamicTheme)}</style>
          </Head>
          {dynamicTheme === "cclw" && <Banner />}
          <div id={dynamicTheme} className="h-full">
            <Component {...pageProps} />
          </div>
          <CookieConsent />
        </AdobeContext.Provider>
      </ThemeContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async () => {
  const initialProps = App.getInitialProps;
  if (typeof window !== "undefined") {
    return { ...initialProps };
  }

  return { ...initialProps, theme: process.env.THEME ?? "cpr", adobeApiKey: process.env.ADOBE_API_KEY ?? "" };
};

export default MyApp;
