import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Atoms/Loading",
  component: Loading,
  parameters: { layout: "centered" },
  argTypes: {
    className: { control: "text" },
    size: { control: "number" },
  },
} satisfies Meta<typeof Loading>;
type TStory = StoryObj<typeof Loading>;

export default meta;

export const Default: TStory = {
  args: {
    className: "",
    size: 80,
  },
};
