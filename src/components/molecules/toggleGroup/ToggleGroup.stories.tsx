import { Meta, StoryObj } from "@storybook/react";
import { LucideScrollText, LucideTable } from "lucide-react";

import { Toggle } from "./Toggle";
import { ToggleGroup } from "./ToggleGroup";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    children: { control: false },
    defaultValue: { control: "object" },
    toggleMultiple: { control: "boolean" },
  },
} satisfies Meta<typeof ToggleGroup>;
type TStory = StoryObj<typeof ToggleGroup>;

export default meta;

export const Default: TStory = {
  args: {
    className: "",
    defaultValue: ["table"],
    toggleMultiple: false,
  },
  render: ({ ...props }) => (
    <ToggleGroup {...props}>
      <Toggle Icon={LucideTable} value="table">
        Table
      </Toggle>
      <Toggle Icon={LucideScrollText} value="list">
        List
      </Toggle>
    </ToggleGroup>
  ),
};
