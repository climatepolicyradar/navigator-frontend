import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import IntelliSearch from "./IntelliSearch";

/**
 * Create a new QueryClient instance for each story to avoid caching issues
 */
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const meta = {
  title: "Experiment/IntelliSearch",
  component: IntelliSearch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An intelligent search component that provides real-time suggestions from two sources: external Labels API and pre-loaded Concepts data. Features debounced search, hover preview cards, and full keyboard navigation.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={createQueryClient()}>
        <div className="w-200 h-150 flex items-start justify-center p-8">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    debounceDelay: {
      control: { type: "number", min: 0, max: 1000, step: 50 },
      description: "Debounce delay in milliseconds",
    },
    maxSuggestions: {
      control: { type: "number", min: 5, max: 50, step: 5 },
      description: "Maximum number of suggestions to display",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof IntelliSearch>;

type TStory = StoryObj<typeof IntelliSearch>;

export default meta;

/**
 * Default story with standard configuration
 * Try typing "climate", "carbon", or "policy" to see suggestions
 */
export const Default: TStory = {
  args: {
    placeholder: "Search for concepts or labels...",
    debounceDelay: 300,
  },
};

/**
 * Story with custom placeholder text
 */
export const CustomPlaceholder: TStory = {
  args: {
    placeholder: "Type to explore climate concepts...",
    debounceDelay: 300,
  },
};

/**
 * Story with faster debounce for more immediate feedback
 */
export const FastDebounce: TStory = {
  args: {
    placeholder: "Search with fast response (100ms debounce)...",
    debounceDelay: 100,
  },
  parameters: {
    docs: {
      description: {
        story: "This variant uses a shorter debounce delay (100ms) for more immediate feedback.",
      },
    },
  },
};

/**
 * Story with slower debounce to reduce API calls
 */
export const SlowDebounce: TStory = {
  args: {
    placeholder: "Search with slower response (500ms debounce)...",
    debounceDelay: 500,
  },
  parameters: {
    docs: {
      description: {
        story: "This variant uses a longer debounce delay (500ms) to reduce the number of API calls.",
      },
    },
  },
};

/**
 * Story with limited number of suggestions
 */
export const LimitedSuggestions: TStory = {
  args: {
    placeholder: "Search (max 10 suggestions)...",
    debounceDelay: 300,
    maxSuggestions: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "This variant limits the number of suggestions to 10 for better performance.",
      },
    },
  },
};

/**
 * Story demonstrating keyboard navigation
 */
export const KeyboardNavigation: TStory = {
  args: {
    placeholder: "Try using arrow keys, Enter, and Escape...",
    debounceDelay: 300,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Type a search term, then use Arrow Up/Down to navigate suggestions, Enter to select (no action in read-only mode), and Escape to clear and close.",
      },
    },
  },
};

/**
 * Story demonstrating hover previews
 */
export const HoverPreview: TStory = {
  args: {
    placeholder: "Hover over concept suggestions to see previews...",
    debounceDelay: 300,
  },
  parameters: {
    docs: {
      description: {
        story: "Hover your mouse over concept suggestions (not labels) to see a preview card with definition and alternative labels.",
      },
    },
  },
};
