import { Meta, StoryObj } from "@storybook/react";

import Pill from "./Pill";

const meta = {
  title: "Old/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Pill>;
type Story = StoryObj<typeof Pill>;

export default meta;

export const SearchQuery: Story = {
  args: {
    children: "Search: electric vehicles",
  },
};

export const SearchCategory: Story = {
  args: {
    children: "UNFCCC",
  },
};

export const SearchRegion: Story = {
  args: {
    children: "North America",
  },
};

export const SearchJurisdiction: Story = {
  args: {
    children: "Canada",
  },
};

export const SearchDate: Story = {
  args: {
    children: "2020 - 2025",
  },
};
