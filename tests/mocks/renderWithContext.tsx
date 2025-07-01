import { render } from "@testing-library/react";
import router from "next-router-mock";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";

export const renderWithContext = async (Component: React.ComponentType<any>, pageProps?: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Set initial route/query if provided
  if (pageProps?.initialUrl || pageProps?.initialQuery) {
    await router.push({
      pathname: pageProps.initialUrl || "/",
      query: pageProps.initialQuery || {},
    });
  }

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
