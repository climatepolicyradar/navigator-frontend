import { Meta, StoryObj } from "@storybook/react";

import { PageHeader } from "./PageHeader";

const meta = {
  title: "Organisms/Sections/PageHeader",
  component: PageHeader,
  argTypes: {},
} satisfies Meta<typeof PageHeader>;
type TStory = StoryObj<typeof PageHeader>;

export default meta;

export const FamilyPage: TStory = {
  args: {
    coloured: false,
    label: "UNFCCC Submission",
    title:
      "Equatorial Guinea Long-Term Low-Emission Development Strategy. LT-LEDS1; Strategy for a Just Transition in Equatorial Guinea and its Gender-Responsive Investment Plan. 2025-2035",
  },
};

export const Coloured: TStory = {
  args: {
    coloured: true,
    label: "Collection",
    title: "UK Climate Change Act",
  },
};
