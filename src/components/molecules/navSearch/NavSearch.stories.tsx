import { Meta, StoryObj } from "@storybook/react/*";
import { NavSearch } from "./NavSearch";

const meta = {
  title: "Molecules/NavSearch",
  component: NavSearch,
} satisfies Meta<typeof NavSearch>;
type Story = StoryObj<typeof NavSearch>;

export default meta;

export const SearchPage: Story = {
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

export const FamilyPage: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/document/national-adaptation-strategy-to-climate-change_3bf7?q=Adaptation+strategy",
        pathname: "/document/national-adaptation-strategy-to-climate-change_3bf7",
        query: {
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const DocumentPage: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/documents/resolution-1302019-f2f2?q=Adaptation+strategy&id=national-adaptation-strategy-to-climate-change_3bf7",
        pathname: "/documents/resolution-1302019-f2f2",
        query: {
          q: "Adaptation strategy",
          id: "national-adaptation-strategy-to-climate-change_3bf7",
        },
      },
    },
  },
};
