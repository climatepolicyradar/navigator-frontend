import { Meta, StoryObj } from "@storybook/react/*";
import { SlideOut } from "./SlideOut";
import { SlideOutContext } from "@/context/SlideOutContext";
import { useState } from "react";

type TStorybookProps = {
  open: boolean;
};

const meta = {
  title: "Atoms/SlideOut",
  component: SlideOut,
  argTypes: {
    children: { control: "text" },
    open: { control: "boolean" },
  },
} satisfies Meta<typeof SlideOut | TStorybookProps>;
type Story = StoryObj<typeof SlideOut | TStorybookProps>;

export default meta;

export const Default: Story = {
  args: {
    children: "SlideOut children",
  },
  render: ({ children, open }) => {
    // const [x, setX] = useState(open ? "x" : "");
    return (
      // <SlideOutContext.Provider value={{ currentSlideOut: x, setCurrentSlideOut: setX }}>
      <div className="relative h-screen w-4">
        <SlideOut>{children}</SlideOut>
      </div>
      // </SlideOutContext.Provider>
    );
  },
};
