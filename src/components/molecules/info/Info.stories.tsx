import { Meta, StoryObj } from "@storybook/react/*";
import { Info } from "./Info";

const meta = {
  title: "Molecules/Info",
  component: Info,
  parameters: { layout: "centered" },
  argTypes: {},
} satisfies Meta<typeof Info>;
type Story = StoryObj<typeof Info>;

export default meta;

export const Filters: Story = {
  args: {
    title: "About",
    description: "Narrow down your results using the filter below. You can also combine these with a search term.",
    link: {
      href: "#",
      text: "Learn more",
    },
  },
};

export const Minimal: Story = {
  args: {
    description: "Here is some more info!",
  },
};
