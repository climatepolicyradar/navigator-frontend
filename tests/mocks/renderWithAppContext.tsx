vi.mock("next/router", () => require("next-router-mock"));

import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";

export const renderWithAppContext = async (Component: React.ComponentType<any>, pageProps?: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: pageProps?.theme, themeConfig: pageProps?.themeConfig }}>
        <EnvConfigContext.Provider value={pageProps?.envConfig}>
          <Component {...pageProps} />
        </EnvConfigContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};
