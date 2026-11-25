import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiltersContext, TDateRange } from "@/context/FiltersContext";
import { TFilterPathLabel } from "@/types";

import { AppliedFilters } from "./AppliedFilters";

const CHECKED_LABEL_PATHS: TFilterPathLabel[][] = [
  [
    {
      id: "author_type::Non-Party",
      type: "author_type",
      value: "Non-Party",
    },
    {
      id: "category::UN submission",
      type: "category",
      value: "UN submission",
    },
  ],
  [
    {
      id: "un_convention::UNCCD",
      type: "un_convention",
      value: "UNCCD",
    },
    {
      id: "category::UN submission",
      type: "category",
      value: "UN submission",
    },
  ],
  [
    {
      id: "entity_type::National Adaptation Plan (NAP)",
      type: "entity_type",
      value: "National Adaptation Plan (NAP)",
    },
    {
      id: "un_convention::UNFCCC",
      type: "un_convention",
      value: "UNFCCC",
    },
    {
      id: "category::UN submission",
      type: "category",
      value: "UN submission",
    },
  ],
];

const meta = {
  title: "Molecules/AppliedFilters",
  component: AppliedFilters,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AppliedFilters>;
type TStory = StoryObj<typeof AppliedFilters>;

export default meta;

const useFiltersContext = (checkedLabelPaths: TFilterPathLabel[][], appliedDateRange: TDateRange = null, includeDateRange = false) => {
  return (
    <FiltersContext
      value={{
        appliedDateRange,
        checkedLabelPaths,
        clearFilters: () => console.info("clearFilters"),
        labelValues: {},
        setDateRange: (dateRange) => console.info({ dateRange }),
        toggleFilter: (labelPath, checked) => console.info({ labelPath, checked }),
      }}
    >
      <AppliedFilters includeDateRange={includeDateRange} />
    </FiltersContext>
  );
};

export const Default: TStory = {
  render: () => useFiltersContext(CHECKED_LABEL_PATHS),
};

export const SingleFilter: TStory = {
  render: () => useFiltersContext([[{ id: "region::Europe", type: "region", value: "Europe" }]]),
};

export const WithDateRange: TStory = {
  render: () => useFiltersContext(CHECKED_LABEL_PATHS, [1992, 2002], true),
};
