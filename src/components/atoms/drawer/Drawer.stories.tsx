import { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/components/atoms/button/Button";
import { LOREM_IPSUM } from "@/constants/stories";

import { Drawer } from "./Drawer";

const meta = {
  title: "Atoms/Drawer",
  component: Drawer,
  argTypes: {
    children: { control: false },
    trigger: { control: false },
  },
} satisfies Meta<typeof Drawer>;
type TStory = StoryObj<typeof Drawer>;

export default meta;

const trigger = <Button>Open drawer</Button>;

export const RightSide: TStory = {
  args: {
    children: <h1 className="text-2xl text-gray-950 font-heavy leading-tight">This is a drawer</h1>,
    trigger,
  },
};

export const LeftSide: TStory = {
  args: {
    ...RightSide.args,
    direction: "left",
  },
};

export const Scrolling: TStory = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        {LOREM_IPSUM.map((line, lineIndex) => (
          <p key={lineIndex}>{line}</p>
        ))}
      </div>
    ),
    trigger,
  },
};
