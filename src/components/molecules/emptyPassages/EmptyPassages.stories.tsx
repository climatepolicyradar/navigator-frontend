import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmptyPassages } from "./EmptyPassages";

const meta = {
  title: "Molecules/EmptyPassages",
  component: EmptyPassages,
  parameters: { layout: "centered" },
  args: { onClearClick: () => {} },
  argTypes: {
    onClearClick: { control: false },
  },
} satisfies Meta<typeof EmptyPassages>;
type TStory = StoryObj<typeof EmptyPassages>;

export default meta;

export const NoQuery: TStory = {
  args: {
    hasQuery: false,
  },
};

export const NoResults: TStory = {
  args: {
    hasQuery: true,
  },
};

export const SeveralDocuments: TStory = {
  args: {
    hasQuery: false,
    subject: "these documents",
  },
};
