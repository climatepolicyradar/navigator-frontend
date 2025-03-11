import App, { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { AdobeContext } from "@/context/AdobeContext";
import { PostHogProvider } from "@/context/PostHogProvider";
import { ThemeContext } from "@/context/ThemeContext";

import "../styles/flag-icons.css";
import "../styles/main.css";

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

  const [consent, setConsent] = useState(false);
  const onConsentChange = (consent: boolean) => {
    setConsent(consent);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={dynamicTheme}>
        <AdobeContext.Provider value={dynamicAdobeKey}>
          <PostHogProvider consent={consent}>
            <ErrorBoundary level="top">
              <Head>
                <link rel="icon" href={favicon} />
              </Head>
              <div id={dynamicTheme} className="h-full">
                <Component {...pageProps} />
              </div>
              <CookieConsent onConsentChange={onConsentChange} />
            </ErrorBoundary>
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

  return {
    ...initialProps,
    theme: process.env.THEME,
    adobeApiKey: process.env.ADOBE_API_KEY ?? "",
  };
};

export default MyApp;
