import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFilterParent } from "./SearchFilterParent";

const meta = {
  title: "Molecules/SearchFilterParent",
  component: SearchFilterParent,
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
      <SearchFilterParent {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFilterParent>;
type TStory = StoryObj<typeof SearchFilterParent>;

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
