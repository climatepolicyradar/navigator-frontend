import { Meta, StoryObj } from "@storybook/nextjs";
import { LucideScrollText, LucideTable } from "lucide-react";

import { Toggle } from "./Toggle";
import { ToggleGroup } from "./ToggleGroup";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    bordered: { control: "boolean" },
    children: { control: false },
  },
} satisfies Meta<typeof ToggleGroup>;
type TStory = StoryObj<typeof ToggleGroup>;

export default meta;

export const DocumentsBlock: TStory = {
  args: {
    bordered: false,
    children: (
      <>
        <Toggle Icon={LucideScrollText} text="Card" value="card" />
        <Toggle Icon={LucideTable} text="Table" value="table" />
      </>
    ),
    className: "",
    defaultValue: ["card"],
  },
};
