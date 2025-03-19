import { Meta, StoryObj } from "@storybook/react/*";
import { NavBar } from "./NavBar";

const meta = {
  title: "Organisms/Surfaces/NavBar",
  component: NavBar,
} satisfies Meta<typeof NavBar>;
type Story = StoryObj<typeof NavBar>;

export default meta;

export const SearchPage: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: "/search?q=Adaptation+strategy",
        pathname: "/search",
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
      },
    },
  },
};
