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
    onValueChange: { control: false },
    value: { control: false },
  },
} satisfies Meta<typeof Sort>;
type TStory<SortId extends string> = StoryObj<typeof Sort<SortId>>;

export default meta;

const useSortRender = <SortId extends string>({ options, value, ...props }: React.ComponentProps<typeof Sort<SortId>>) => {
  const [selectedId, setSelectedId] = useState<SortId>(value);
  const changeValue = (newValue: SortId) => setSelectedId(newValue);

  return <Sort {...props} options={options} onValueChange={changeValue} value={selectedId} />;
};

type TSearchSortId = "relevance" | "recent" | "oldest" | "title_asc" | "title_desc";

export const SearchResults: TStory<TSearchSortId> = {
  args: {
    defaultId: "relevance",
    options: [
      { id: "relevance", label: "Relevance" },
      { id: "recent", label: "Most recent" },
      { id: "oldest", label: "Oldest" },
      { id: "title_asc", label: "A-Z" },
      { id: "title_desc", label: "Z-A" },
    ],
    value: "relevance",
  },
  render: useSortRender,
};

type TPassageSortId = "relevance desc" | "idx asc";

export const DocumentPassages: TStory<TPassageSortId> = {
  args: {
    defaultId: "relevance desc",
    options: [
      { id: "relevance desc", label: "Relevance" },
      { id: "idx asc", label: "Page Number" },
    ],
    value: "relevance desc",
  },
  render: useSortRender,
};

/* The option is named in the trigger as soon as the selection moves off the default. */
export const NonDefaultSelection: TStory<TSearchSortId> = {
  args: {
    ...SearchResults.args,
    value: "oldest",
  },
  render: useSortRender,
};

export const CustomLabel: TStory<TSearchSortId> = {
  args: {
    ...SearchResults.args,
    label: "Order by",
  },
  render: useSortRender,
};
