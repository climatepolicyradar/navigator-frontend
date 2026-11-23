vi.mock("next/router", () => require("next-router-mock"));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { EnvConfigContext } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { ThemeContext } from "@/context/ThemeContext";

import { setUpThemeConfig } from "./api/configHandlers";

export const renderWithAppContext = (Component: React.ComponentType<any>, { pageProps, features }: { pageProps?: any; features?: any }) => {
  setUpThemeConfig(pageProps?.themeConfig);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: pageProps?.theme, themeConfig: pageProps?.themeConfig }}>
        <FeaturesContext.Provider value={features || DEFAULT_FEATURES}>
          <EnvConfigContext.Provider value={pageProps?.envConfig}>
            <Component {...pageProps} />
          </EnvConfigContext.Provider>
        </FeaturesContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );

  return renderResult;
};
