import { Meta, StoryObj } from "@storybook/react/*";
import { Button } from "../button/Button";
import { Popover } from "./Popover";

const meta = {
  title: "Atoms/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    onOpenChange: { control: false },
    trigger: { control: false },
  },
} satisfies Meta<typeof Popover>;
type TStory = StoryObj<typeof Popover>;

export default meta;

const trigger = <Button>Trigger</Button>;

export const WithChildren: TStory = {
  args: {
    children: "Hello, I am a popover!",
    openOnHover: false,
    trigger,
  },
};

export const WithElements: TStory = {
  args: {
    description: "This is the popover description. Lots of text can go here, if you'd like.",
    link: {
      href: "#",
      text: "Link",
    },
    openOnHover: false,
    title: "Title",
    trigger,
  },
};
