import { Meta, StoryObj } from "@storybook/nextjs";

import { Toggle } from "./Toggle";
import { ToggleGroup } from "./ToggleGroup";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof ToggleGroup>;
type TStory = StoryObj<typeof ToggleGroup>;

export default meta;

export const DocumentsBlock: TStory = {
  args: {
    children: (
      <>
        <Toggle value="table">Table</Toggle>
        <Toggle value="cards">Cards</Toggle>
      </>
    ),
    defaultValue: ["table"],
  },
};
