import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NavSearch } from "./NavSearch";

const meta = {
  title: "Molecules/NavSearch",
  component: NavSearch,
} satisfies Meta<typeof NavSearch>;
type TStory = StoryObj<typeof NavSearch>;

export default meta;

export const SearchPage: TStory = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/search?q=Adaptation+strategy",
        pathname: "/search",
        query: {
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const GeographyPage: TStory = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/geographies/saint-kitts-and-nevis?q=Adaptation+strategy",
        pathname: "/geographies/[id]",
        query: {
          id: "saint-kitts-and-nevis",
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const FamilyPage: TStory = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/document/national-adaptation-strategy-to-climate-change_3bf7?q=Adaptation+strategy",
        pathname: "/document/[id]",
        query: {
          id: "national-adaptation-strategy-to-climate-change_3bf7",
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const DocumentPage: TStory = {
  parameters: {
    nextjs: {
      router: {
        asPath:
          "/documents/national-strategy-for-adaptation-to-climate-change_f1a4?q=Adaptation+strategy&id=national-adaptation-strategy-to-climate-change_3bf7",
        pathname: "/documents/[id]",
        query: {
          q: "Adaptation strategy",
          id: "national-strategy-for-adaptation-to-climate-change_f1a4",
        },
      },
    },
  },
};
