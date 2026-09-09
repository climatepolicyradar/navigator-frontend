import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ZeroStatePassages } from "./ZeroStatePassages";

const meta = {
  title: "Molecules/ZeroStatePassages",
  component: ZeroStatePassages,
  parameters: { layout: "centered" },
  args: { onClearSearch: () => {} },
  argTypes: {
    onClearSearch: { control: false },
  },
} satisfies Meta<typeof ZeroStatePassages>;
type TStory = StoryObj<typeof ZeroStatePassages>;

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
