import { Meta, StoryObj } from "@storybook/react/*";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Organisms/PageHeader",
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;
type Story = StoryObj<typeof PageHeader>;

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
