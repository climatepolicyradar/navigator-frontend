import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Preview } from "@storybook/nextjs-vite";

import { DEFAULT_FEATURE_FLAGS } from "../src/constants/features";
import { FeaturesContext } from "../src/context/FeaturesContext";
import { ThemeContext } from "../src/context/ThemeContext";
import "../src/styles/main.css";
import { TTheme, TThemeConfig } from "../src/types";
import { getFeatures } from "../src/utils/features";
import CCCconfig from "../themes/ccc/config";
import CCLWconfig from "../themes/cclw/config";
import CPRconfig from "../themes/cpr/config";
import MCFconfig from "../themes/mcf/config";

const themeItems: TTheme[] = ["cpr", "cclw", "mcf", "ccc"];
const themeConfigs: Record<TTheme, TThemeConfig> = {
  ccc: CCCconfig,
  cclw: CCLWconfig,
  cpr: CPRconfig,
  mcf: MCFconfig,
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "The app theme e.g. CCLW",
      toolbar: {
        title: "Theme",
        icon: "browser",
        items: themeItems,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "cpr",
  },
  decorators: [
    (Story, { globals }) => {
      const queryClient = new QueryClient();
      const theme = globals.theme as TTheme;
      const features = getFeatures(themeConfigs[theme], DEFAULT_FEATURE_FLAGS);

      return (
        <div className="root isolate">
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={{ theme, themeConfig: themeConfigs[theme], loaded: true }}>
              <FeaturesContext.Provider value={features}>
                <Story />
              </FeaturesContext.Provider>
            </ThemeContext.Provider>
          </QueryClientProvider>
        </div>
      );
    },
  ],
};

export default preview;
