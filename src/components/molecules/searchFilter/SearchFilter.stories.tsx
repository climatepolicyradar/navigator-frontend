import { Meta, StoryObj } from "@storybook/nextjs-vite";
import uniqBy from "lodash/uniqBy";
import { useState } from "react";

import { FiltersContext, TToggleFilterCallback } from "@/context/FiltersContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";

import { SearchFilter } from "./SearchFilter";

const meta = {
  title: "Molecules/SearchFilter",
  component: SearchFilter,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  render: (props) => {
    const [checkedLabelPaths, setCheckedLabelPaths] = useState<TFilterPathLabel[][]>([]);

    const toggleFilter: TToggleFilterCallback = (labelPath, checked) => {
      const updatedCheckedLabelPaths = sortFilterPathLabels(
        checked === true // indeterminate is treated as unchecked
          ? uniqBy([...checkedLabelPaths, labelPath], getLabelPathSignature)
          : checkedLabelPaths.filter((labels) => getLabelPathSignature(labels) !== getLabelPathSignature(labelPath))
      );

      setCheckedLabelPaths(updatedCheckedLabelPaths);
    };

    return (
      <FiltersContext value={{ checkedLabelPaths, clearFilters: () => {}, labelValues: {}, toggleFilter }}>
        <ul className="list-none w-100">
          <SearchFilter {...props} />
        </ul>
      </FiltersContext>
    );
  },
} satisfies Meta<typeof SearchFilter>;
type TStory = StoryObj<typeof SearchFilter>;

const generateLabel = (value: string): TNestedSearchLabel => ({
  id: `test::${value}`,
  type: "test",
  value,
  children: [] as TNestedSearchLabel[],
});

export default meta;

export const OneLevel: TStory = {
  args: {
    ancestorPath: [],
    label: generateLabel("Filter"),
  },
};

export const TwoLevels: TStory = {
  args: {
    ancestorPath: [],
    label: {
      ...generateLabel("Parent"),
      children: ["Child 1", "Child 2", "Child 3"].map(generateLabel),
    },
  },
};

export const ThreeLevels: TStory = {
  args: {
    ancestorPath: [],
    label: {
      ...generateLabel("Grandparent"),
      children: [
        {
          ...generateLabel("Parent A"),
          children: ["Child A1", "Child A2", "Child A3"].map(generateLabel),
        },
        generateLabel("Parent B"),
        {
          ...generateLabel("Parent C"),
          children: ["Child C1", "Child C2"].map(generateLabel),
        },
      ],
    },
  },
};
