import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListFilter } from "lucide-react";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFiltersDrawer } from "./SearchFiltersDrawer";

const meta = {
  title: "Molecules/SearchFiltersDrawer",
  component: SearchFiltersDrawer,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  render: (props) => (
    <FiltersContext
      // eslint-disable-next-line no-console
      value={{ checkedLabelPaths: [], clearFilters: () => {}, toggleFilter: (labelPath, checked) => console.info({ labelPath, checked }) }}
    >
      <SearchFiltersDrawer {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFiltersDrawer>;
type TStory = StoryObj<typeof SearchFiltersDrawer>;

const generateLabel = (value: string): TNestedSearchLabel => ({
  id: `category::${value}`,
  type: "category",
  value,
  children: [],
});

const CATEGORY_LABELS = ["Corporate Disclosure", "Law", "Litigation", "Multilateral Climate Fund project", "Policy", "Report", "UN Submission"].map(
  generateLabel
);

export default meta;

export const Default: TStory = {
  args: {
    filterGroup: {
      title: "Category",
      Icon: ListFilter,
      container: "drawer",
      rootLabelTypes: ["category"],
      nestedLabels: CATEGORY_LABELS,
    },
  },
};
