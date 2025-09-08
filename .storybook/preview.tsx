import type { Preview } from "@storybook/nextjs";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import "../src/styles/main.css";

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
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();

      return (
        <div className="root isolate">
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </div>
      );
    },
  ],
};

export default preview;
