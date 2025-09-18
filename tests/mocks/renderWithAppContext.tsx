vi.mock("next/router", () => require("next-router-mock"));

import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { SlideOutContext } from "@/context/SlideOutContext";
import { ThemeContext } from "@/context/ThemeContext";

import { setUpThemeConfig } from "./api/configHandlers";

export const renderWithAppContext = (Component: React.ComponentType<any>, pageProps?: any, slideOutContext?: any) => {
  setUpThemeConfig(pageProps?.themeConfig);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const defaultSlideOutContext = { currentSlideOut: "", setCurrentSlideOut: () => {} };

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: pageProps?.theme, themeConfig: pageProps?.themeConfig, loaded: Boolean(pageProps) }}>
        <EnvConfigContext.Provider value={pageProps?.envConfig}>
          <SlideOutContext.Provider value={slideOutContext || defaultSlideOutContext}>
            <Component {...pageProps} />
          </SlideOutContext.Provider>
        </EnvConfigContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );

  // Add a custom rerender function that can update the context
  const customRerender = (newComponent: React.ComponentType<any>, newPageProps?: any, newSlideOutContext?: any) => {
    const ComponentToRender = newComponent;
    return renderResult.rerender(
      <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{ theme: newPageProps?.theme, themeConfig: newPageProps?.themeConfig, loaded: Boolean(newPageProps) }}>
          <EnvConfigContext.Provider value={newPageProps?.envConfig}>
            <SlideOutContext.Provider value={newSlideOutContext || defaultSlideOutContext}>
              <ComponentToRender {...newPageProps} />
            </SlideOutContext.Provider>
          </EnvConfigContext.Provider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    );
  };

  return {
    ...renderResult,
    rerender: customRerender,
  };
};
