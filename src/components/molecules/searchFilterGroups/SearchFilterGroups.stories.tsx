import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFilterGroups } from "./SearchFilterGroups";

const meta = {
  title: "Molecules/SearchFilterGroups",
  component: SearchFilterGroups,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  render: (props) => (
    <FiltersContext
      value={{
        checkedLabelPaths: [],
        clearFilters: () => {},
        labelValues: {},
        // eslint-disable-next-line no-console
        toggleFilter: (labelPath, checked) => console.info({ labelPath, checked }),
      }}
    >
      <SearchFilterGroups {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFilterGroups>;
type TStory = StoryObj<typeof SearchFilterGroups>;

const labels: TNestedSearchLabel[] = [
  {
    id: "author_type::Non-Party",
    type: "author_type",
    value: "Non-Party",
    children: [],
  },
  {
    id: "author_type::Party",
    type: "author_type",
    value: "Party",
    children: [],
  },
  {
    id: "un_convention::CBD",
    type: "un_convention",
    value: "CBD",
    children: [],
  },
  {
    id: "un_convention::UNCCD",
    type: "un_convention",
    value: "UNCCD",
    children: [],
  },
  {
    id: "un_convention::UNFCCC",
    type: "un_convention",
    value: "UNFCCC",
    children: [],
  },
];

export default meta;

export const Default: TStory = {
  args: {
    ancestorPath: [],
    labels,
  },
};
