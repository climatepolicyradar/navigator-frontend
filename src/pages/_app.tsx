import { useEffect, useState } from "react";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import "../styles/flag-icons.css";
import "../styles/main.css";

import { ThemeContext } from "@/context/ThemeContext";
import { AdobeContext } from "@/context/AdobeContext";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { PostHogProvider } from "@/context/PostHogProvider";
import { EnvConfigContext } from "@/context/EnvConfig";

const favicon = `/images/favicon/${process.env.THEME}.png`;

const queryClient = new QueryClient();

interface IProps extends AppProps {
  theme?: string;
  adobeApiKey?: string;
}

function MyApp({ Component, pageProps, theme, adobeApiKey }: IProps) {
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

  const [consent, setConsent] = useState(false);
  const onConsentChange = (consent: boolean) => {
    setConsent(consent);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={dynamicTheme}>
        <AdobeContext.Provider value={dynamicAdobeKey}>
          <PostHogProvider consent={consent}>
            <EnvConfigContext.Provider value={pageProps?.envConfig}>
              <ErrorBoundary level="top">
                <Head>
                  <link rel="icon" href={favicon} />
                </Head>
                <div id={dynamicTheme}>
                  <Component {...pageProps} />
                </div>
                <CookieConsent onConsentChange={onConsentChange} />
              </ErrorBoundary>
            </EnvConfigContext.Provider>
          </PostHogProvider>
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

  return { ...initialProps, theme: process.env.THEME, adobeApiKey: process.env.ADOBE_API_KEY ?? "" };
};

export default MyApp;
