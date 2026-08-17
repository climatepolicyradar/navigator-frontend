import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Sort } from "./Sort";

const meta = {
  title: "Molecules/Sort",
  component: Sort,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onChange: { control: false },
    value: { control: false },
  },
} satisfies Meta<typeof Sort>;
type TStory = StoryObj<typeof Sort>;

export default meta;

const useSortRender = ({ sortOptions, value, ...props }: React.ComponentProps<typeof Sort>) => {
  const [selectedId, setSelectedId] = useState(value);
  const changeValue = (newValue: string) => setSelectedId(newValue);

  return <Sort {...props} sortOptions={sortOptions} onChange={changeValue} value={selectedId} />;
};

export const SearchResults: TStory = {
  args: {
    sortOptions: [
      { paramValue: "relevance", label: "Relevance" },
      { paramValue: "recent", label: "Most recent" },
      { paramValue: "oldest", label: "Oldest" },
      { paramValue: "title_asc", label: "A-Z" },
      { paramValue: "title_desc", label: "Z-A" },
    ],
    value: "relevance",
  },
  render: useSortRender,
};

export const DocumentPassages: TStory = {
  args: {
    sortOptions: [
      { paramValue: "relevance desc", label: "Relevance" },
      { paramValue: "idx asc", label: "Page Number" },
    ],
    value: "relevance desc",
  },
  render: useSortRender,
};

/* The option is named in the trigger as soon as the selection moves off the default. */
export const NonDefaultSelection: TStory = {
  args: {
    ...SearchResults.args,
    value: "oldest",
  },
  render: useSortRender,
};

export const CustomLabel: TStory = {
  args: {
    ...SearchResults.args,
    label: "Order by",
  },
  render: useSortRender,
};
