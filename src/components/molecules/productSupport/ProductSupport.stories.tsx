import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProductSupport } from "./ProductSupport";

const meta = {
  title: "Molecules/ProductSupport",
  component: ProductSupport,
} satisfies Meta<typeof ProductSupport>;
type TStory = StoryObj<typeof ProductSupport>;

export default meta;

export const Tooltip: TStory = {
  args: {
    content: "topics",
    tooltip: true,
  },
};

export const WithChildren: TStory = {
  args: {
    content: "topics",
    children: "Product support",
  },
};
