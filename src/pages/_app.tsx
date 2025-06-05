import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Overlays } from "@/components/organisms/overlays/Overlays";
import { COOKIE_FEATURES_NAME } from "@/constants/cookies";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { AdobeContext } from "@/context/AdobeContext";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { PostHogProvider } from "@/context/PostHogProvider";
import { ThemeContext } from "@/context/ThemeContext";
import "../styles/flag-icons.css";
import "../styles/main.css";
import { TTheme, TThemeConfig } from "@/types";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";
import { readConfigFile } from "@/utils/readConfigFile";

const theme = (process.env.THEME ?? "cpr") as TTheme;
const adobeApiKey = process.env.ADOBE_API_KEY ?? "";

const favicon = `/images/favicon/${process.env.THEME}.png`;

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [previousNewFeature, setPreviousNewFeature] = useState<number | null>(null);
  const [displayNewFeature, setDisplayNewFeature] = useState<number | null>(null);
  const [themeConfig, setThemeConfig] = useState<TThemeConfig>(DEFAULT_THEME_CONFIG);

  const getThemeConfig = async () => {
    const config = await readConfigFile(theme);
    setThemeConfig(config);
  };

  useEffect(() => {
    // For access inside Cypress:
    if (window?.Cypress) {
      window.queryClient = queryClient;
    }

    // Determine the last feature the user saw
    const updateCookie = parseInt(getCookie(COOKIE_FEATURES_NAME));
    setPreviousNewFeature(Number.isNaN(updateCookie) ? -1 : updateCookie);

    getThemeConfig();
  }, []);

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
      <ThemeContext.Provider value={{ theme, themeConfig }}>
        <NewFeatureContext.Provider value={newFeatureContextProviderValue}>
          <AdobeContext.Provider value={adobeApiKey}>
            <PostHogProvider consent={consent}>
              <ErrorBoundary level="top">
                <Head>
                  <link rel="icon" href={favicon} />
                </Head>
                <div id={theme}>
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
