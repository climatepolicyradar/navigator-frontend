import { Meta, StoryObj } from "@storybook/react";

import { SlideOutContext } from "@/context/SlideOutContext";

import { SlideOut } from "./SlideOut";

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
