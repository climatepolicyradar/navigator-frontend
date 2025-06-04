import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Overlays } from "@/components/organisms/overlays/Overlays";
import { COOKIE_FEATURES_NAME } from "@/constants/cookies";
import { AdobeContext } from "@/context/AdobeContext";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { PostHogProvider } from "@/context/PostHogProvider";
import { ThemeContext } from "@/context/ThemeContext";
import "../styles/flag-icons.css";
import "../styles/main.css";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";

const favicon = `/images/favicon/${process.env.THEME}.png`;

const queryClient = new QueryClient();

interface IProps extends AppProps {
  theme?: string;
  adobeApiKey?: string;
}

function MyApp({ Component, pageProps, theme, adobeApiKey }: IProps) {
  const [siteTheme, setSiteTheme] = useState(null);
  const [adobeKey, setAdobeKey] = useState(null);
  const [previousNewFeature, setPreviousNewFeature] = useState<number | null>(null);
  const [displayNewFeature, setDisplayNewFeature] = useState<number | null>(null);

  useEffect(() => {
    // For access inside Cypress:
    if (window?.Cypress) {
      window.queryClient = queryClient;
    }

    // Determine the last feature the user saw
    const updateCookie = parseInt(getCookie(COOKIE_FEATURES_NAME));
    setPreviousNewFeature(Number.isNaN(updateCookie) ? -1 : updateCookie);
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

  const setNewFeatureSeen = (order: number) => {
    setCookie(COOKIE_FEATURES_NAME, order.toString(), getDomain());
    setPreviousNewFeature(order);
  };
  const newFeatureContextProviderValue = {
    displayNewFeature,
    setDisplayNewFeature,
    previousNewFeature,
    setPreviousNewFeature: setNewFeatureSeen,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={dynamicTheme}>
        <NewFeatureContext.Provider value={newFeatureContextProviderValue}>
          <AdobeContext.Provider value={dynamicAdobeKey}>
            <PostHogProvider consent={consent}>
              <ErrorBoundary level="top">
                <Head>
                  <link rel="icon" href={favicon} />
                </Head>
                <div id={dynamicTheme}>
                  <Component {...pageProps} />
                </div>
                <Overlays onConsentChange={onConsentChange} />
              </ErrorBoundary>
            </PostHogProvider>
          </AdobeContext.Provider>
        </NewFeatureContext.Provider>
      </ThemeContext.Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default MyApp;
