vi.mock("next/router", () => require("next-router-mock"));

import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";

import { setUpThemeConfig } from "./api/configHandlers";

export const renderWithAppContext = (Component: React.ComponentType<any>, pageProps?: any) => {
  setUpThemeConfig(pageProps?.themeConfig);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: pageProps?.theme, themeConfig: pageProps?.themeConfig }}>
        <EnvConfigContext.Provider value={pageProps?.envConfig}>
          <Component {...pageProps} />
        </EnvConfigContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};
