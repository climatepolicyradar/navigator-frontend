import { Meta, StoryObj } from "@storybook/react";

import { DocumentSection } from "./DocumentSection";

const meta = {
  title: "Organisms/Sections/DocumentSection",
  component: DocumentSection,
  argTypes: {},
} satisfies Meta<typeof DocumentSection>;
type TStory = StoryObj<typeof DocumentSection>;

export default meta;

export const Default: TStory = {
  args: {},
};
