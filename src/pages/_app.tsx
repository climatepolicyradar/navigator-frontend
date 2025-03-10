import App, { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import "../styles/flag-icons.css";
import "../styles/main.scss";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { AdobeContext } from "@/context/AdobeContext";
import { ThemeContext } from "@/context/ThemeContext";

const favicon = `/images/favicon/${process.env.THEME}.png`;

const queryClient = new QueryClient();

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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={dynamicTheme}>
        <AdobeContext.Provider value={dynamicAdobeKey}>
          <ErrorBoundary level="top">
            <Head>
              <link rel="icon" href={favicon} />
            </Head>
            <div id={dynamicTheme} className="h-full">
              <Component {...pageProps} />
            </div>
            <CookieConsent />
          </ErrorBoundary>
        </AdobeContext.Provider>
      </ThemeContext.Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async () => {
  const initialProps = App.getInitialProps;
  if (typeof window !== "undefined") {
    return { ...initialProps };
  }

  return {
    ...initialProps,
    theme: process.env.THEME,
    adobeApiKey: process.env.ADOBE_API_KEY ?? "",
  };
};

export default MyApp;
