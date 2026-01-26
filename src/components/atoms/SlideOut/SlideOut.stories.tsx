import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SlideOutContext } from "@/context/SlideOutContext";

import { SlideOut } from "./SlideOut";

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
  render: ({ children }: { children: React.ReactNode }) => {
    return (
      <SlideOutContext.Provider value={{ currentSlideOut: "concepts", setCurrentSlideOut: () => {} }}>
        <div className="relative h-screen w-4">
          <SlideOut>{children}</SlideOut>
        </div>
      </SlideOutContext.Provider>
    );
  },
};
