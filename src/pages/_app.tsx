import App, { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Overlays } from "@/components/organisms/overlays/Overlays";
import { COOKIE_FEATURES_NAME } from "@/constants/cookies";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { AdobeContext } from "@/context/AdobeContext";
import { EnvConfigContext } from "@/context/EnvConfig";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { PostHogProvider } from "@/context/PostHogProvider";
import { ThemeContext, IProps as IThemeContextProps } from "@/context/ThemeContext";
import "../styles/flag-icons.css";
import "../styles/main.css";
import { TTheme } from "@/types";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";
import { readConfigFile } from "@/utils/readConfigFile";

const favicon = `/images/favicon/${process.env.THEME}.png`;

const queryClient = new QueryClient();

interface IProps extends AppProps {
  theme?: string;
  adobeApiKey?: string;
}

function MyApp({ Component, pageProps, theme, adobeApiKey }: IProps) {
  const [siteTheme, setSiteTheme] = useState(null);
  const [adobeKey, setAdobeKey] = useState(null);
  const [themeContext, setThemeContext] = useState<IThemeContextProps>({
    theme: theme as TTheme,
    themeConfig: DEFAULT_THEME_CONFIG,
    loaded: false,
  });

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

  useEffect(() => {
    const getThemeConfig = async () => {
      const themeConfig = await readConfigFile(dynamicTheme);
      setThemeContext((current) => ({ ...current, themeConfig, loaded: true }));
    };
    if (dynamicTheme) getThemeConfig();
  }, [dynamicTheme]);

  const [consent, setConsent] = useState(false);
  const onConsentChange = (consent: boolean) => {
    setConsent(consent);
  };

  /* New features (onboarding) */

  const [previousNewFeature, setPreviousNewFeature] = useState<number | null>(null);
  const [displayNewFeature, setDisplayNewFeature] = useState<number | null>(null);

  useEffect(() => {
    // Determine the last feature the user saw. -1 = none
    const newFeaturesCookie = parseInt(getCookie(COOKIE_FEATURES_NAME));
    setPreviousNewFeature(Number.isNaN(newFeaturesCookie) ? -1 : newFeaturesCookie);
  }, [dynamicTheme]);

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

  /* Render */

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeContext}>
        <NewFeatureContext.Provider value={newFeatureContextProviderValue}>
          <AdobeContext.Provider value={dynamicAdobeKey}>
            <PostHogProvider consent={consent}>
              <EnvConfigContext.Provider value={pageProps?.envConfig}>
                <ErrorBoundary level="top">
                  <Head>
                    <link rel="icon" href={favicon} />
                  </Head>
                  <div id={theme}>
                    <Component {...pageProps} />
                  </div>
                  <Overlays onConsentChange={onConsentChange} />
                </ErrorBoundary>
              </EnvConfigContext.Provider>
            </PostHogProvider>
          </AdobeContext.Provider>
        </NewFeatureContext.Provider>
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
