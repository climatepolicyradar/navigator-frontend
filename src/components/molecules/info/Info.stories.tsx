import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Info } from "./Info";

const meta = {
  title: "Molecules/Info",
  component: Info,
  parameters: { layout: "centered" },
  argTypes: {},
} satisfies Meta<typeof Info>;
type TStory = StoryObj<typeof Info>;

export default meta;

export const Filters: TStory = {
  args: {
    title: "About",
    description: "Narrow down your results using the filter below. You can also combine these with a search term.",
    link: {
      href: "#",
      text: "Learn more",
    },
  },
};

export const Minimal: TStory = {
  args: {
    description: "Here is some more info!",
  },
};
