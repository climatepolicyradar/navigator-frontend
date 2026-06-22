import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFilterCategory } from "./SearchFilterCategory";

const meta = {
  title: "Molecules/SearchFilterCategory",
  component: SearchFilterCategory,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  render: (props) => (
    <FiltersContext
      // eslint-disable-next-line no-console
      value={{ checkedLabelPaths: [], clearFilters: () => {}, toggleFilter: (labelPath, checked) => console.info({ labelPath, checked }) }}
    >
      <SearchFilterCategory {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFilterCategory>;
type TStory = StoryObj<typeof SearchFilterCategory>;

const generateLabel = (value: string): TNestedSearchLabel => ({
  id: `category::${value}`,
  type: "category",
  value,
  children: Array.from({ length: 3 }, (_, index) => ({
    children: [] as TNestedSearchLabel[],
    id: `test::Option ${index}`,
    type: "test",
    value: index.toString(),
  })),
});

export default meta;

export const Default: TStory = {
  args: {
    ancestorPath: [],
    label: generateLabel("UN submission"),
  },
};
