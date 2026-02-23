import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App, { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Overlays } from "@/components/organisms/overlays/Overlays";
import { COOKIE_TUTORIALS_NAME } from "@/constants/cookies";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { AdobeContext } from "@/context/AdobeContext";
import { EnvConfigContext } from "@/context/EnvConfig";
import { PostHogProvider } from "@/context/PostHogProvider";
import { ThemeContext, IProps as IThemeContextProps } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import "../styles/flag-icons.css";
import "../styles/main.css";
import { TTheme, TTutorialName } from "@/types";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";
import { readConfigFile } from "@/utils/readConfigFile";
import { getCompletedTutorialNamesFromCookie } from "@/utils/tutorials";

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

  const [completedTutorials, setCompletedTutorials] = useState<TTutorialName[]>([]);
  const [displayTutorial, setDisplayTutorial] = useState<TTutorialName | null>(null);

  useEffect(() => {
    setCompletedTutorials(getCompletedTutorialNamesFromCookie(getCookie(COOKIE_TUTORIALS_NAME)));
  }, [dynamicTheme]);

  const addCompletedTutorial = (tutorialName: TTutorialName) => {
    setCompletedTutorials((alreadyCompletedTutorials) => {
      const updatedCompletedTutorials = Array.from(new Set([...alreadyCompletedTutorials, tutorialName]));
      setCookie(COOKIE_TUTORIALS_NAME, JSON.stringify(updatedCompletedTutorials), getDomain());
      return updatedCompletedTutorials;
    });
  };

  const tutorialContextProviderValue = {
    displayTutorial,
    setDisplayTutorial,
    completedTutorials,
    addCompletedTutorial,
  };

  /* Render */

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeContext}>
        <TutorialContext.Provider value={tutorialContextProviderValue}>
          <AdobeContext.Provider value={dynamicAdobeKey}>
            <PostHogProvider consent={consent} pageViewProps={pageProps?.posthogPageViewProps}>
              <EnvConfigContext.Provider value={pageProps?.envConfig}>
                <ErrorBoundary level="top">
                  <Head>
                    <link rel="icon" href={favicon} />
                  </Head>
                  <div id={theme} className="root">
                    <Component {...pageProps} />
                  </div>
                  <Overlays onConsentChange={onConsentChange} />
                </ErrorBoundary>
              </EnvConfigContext.Provider>
            </PostHogProvider>
          </AdobeContext.Provider>
        </TutorialContext.Provider>
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
