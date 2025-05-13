import { Meta, StoryObj } from "@storybook/react/*";
import { SlideOut } from "./SlideOut";
import { SlideOutContext } from "@/context/SlideOutContext";
import { useState } from "react";

interface IProps {
  open: boolean;
}

const meta = {
  title: "Atoms/SlideOut",
  component: SlideOut,
  argTypes: {
    children: { control: "text" },
    open: { control: "boolean" },
  },
} satisfies Meta<typeof SlideOut | IProps>;
type TStory = StoryObj<typeof SlideOut | IProps>;

export default meta;

export const Default: TStory = {
  args: {
    children: "SlideOut content",
  },
  render: ({ children }) => {
    return (
      <SlideOutContext.Provider value={{ currentSlideOut: "concepts", setCurrentSlideOut: () => {} }}>
        <div className="relative h-screen w-4">
          <SlideOut>{children}</SlideOut>
        </div>
      </SlideOutContext.Provider>
    );
  },
};
