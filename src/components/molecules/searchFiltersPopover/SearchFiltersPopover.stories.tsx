import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TNestedSearchLabel } from "@/types";

import { SearchFiltersPopover } from "./SearchFiltersPopover";

const meta = {
  title: "Molecules/SearchFiltersPopover",
  component: SearchFiltersPopover,
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
      <SearchFiltersPopover {...props} />
    </FiltersContext>
  ),
} satisfies Meta<typeof SearchFiltersPopover>;
type TStory = StoryObj<typeof SearchFiltersPopover>;

const generateLabel = (value: string): TNestedSearchLabel => ({
  id: `concept::${value}`,
  type: "region",
  value,
  children: [],
});

const CONCEPT_LABELS = [
  "Adaptation enabling factor",
  "Adaptation finance",
  "Adaptation/resilience",
  "Agriculture sector",
  "Air pollution risk",
  "Aligning skills",
  "Ban",
  "Bioenergy",
  "Carbon dioxide",
  "Central bank",
  "Chemical impact",
  "Climate finance",
].map(generateLabel);

export default meta;

export const Default: TStory = {
  args: {
    filterGroup: {
      title: "Topics",
      container: "popover",
      rootLabelTypes: ["concept"],
      nestedLabels: CONCEPT_LABELS,
    },
  },
};
