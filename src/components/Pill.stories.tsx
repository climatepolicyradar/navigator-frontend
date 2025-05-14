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
type TStory = StoryObj<typeof Pill>;

export default meta;

export const SearchQuery: TStory = {
  args: {
    children: "Search: electric vehicles",
  },
};

export const SearchCategory: TStory = {
  args: {
    children: "UNFCCC",
  },
};

export const SearchRegion: TStory = {
  args: {
    children: "North America",
  },
};

export const SearchJurisdiction: TStory = {
  args: {
    children: "Canada",
  },
};

export const SearchDate: TStory = {
  args: {
    children: "2020 - 2025",
  },
};
