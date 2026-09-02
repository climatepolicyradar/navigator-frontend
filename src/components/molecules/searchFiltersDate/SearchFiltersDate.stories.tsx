import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext } from "@/context/FiltersContext";
import { TFiltersGroup } from "@/types";

import { SearchFiltersDate } from "./SearchFiltersDate";

const meta = {
  title: "Molecules/SearchFiltersDate",
  component: SearchFiltersDate,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof SearchFiltersDate>;
type TStory = StoryObj<typeof SearchFiltersDate>;

export default meta;

const currentYear = new Date().getFullYear();

const baseArgs: { filterGroup: TFiltersGroup } = {
  filterGroup: {
    title: "Date range",
    container: "datepicker",
    rootLabelTypes: [],
    nestedLabels: [],
  },
};

export const Default: TStory = {
  args: baseArgs,
  render: (props) => (
    <FiltersContext
      value={{
        appliedDateRange: null,
        checkedLabelPaths: [],
        clearFilters: () => {},
        labelValues: {},
        // eslint-disable-next-line no-console
        setDateRange: (dateRange) => console.info({ dateRange }),
        toggleFilter: () => {},
      }}
    >
      <SearchFiltersDate {...props} />
    </FiltersContext>
  ),
};

export const PresetApplied: TStory = {
  args: baseArgs,
  render: (props) => (
    <FiltersContext
      value={{
        appliedDateRange: [currentYear - 1, currentYear],
        checkedLabelPaths: [],
        clearFilters: () => {},
        labelValues: {},
        // eslint-disable-next-line no-console
        setDateRange: (dateRange) => console.info({ dateRange }),
        toggleFilter: () => {},
      }}
    >
      <SearchFiltersDate {...props} />
    </FiltersContext>
  ),
};

export const CustomRangeApplied: TStory = {
  args: baseArgs,
  render: (props) => (
    <FiltersContext
      value={{
        appliedDateRange: [1992, 2002],
        checkedLabelPaths: [],
        clearFilters: () => {},
        labelValues: {},
        // eslint-disable-next-line no-console
        setDateRange: (dateRange) => console.info({ dateRange }),
        toggleFilter: () => {},
      }}
    >
      <SearchFiltersDate {...props} />
    </FiltersContext>
  ),
};
