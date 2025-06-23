import { Meta, StoryObj } from "@storybook/react";

import { LOREM_IPSUM } from "@/constants/stories";

import { ShowMore } from "./ShowMore";

const meta = {
  title: "Molecules/ShowMore",
  component: ShowMore,
  argTypes: {
    children: { control: false },
    containerClasses: { control: "text" },
    maxHeight: { control: "number" },
  },
} satisfies Meta<typeof ShowMore>;
type TStory = StoryObj<typeof ShowMore>;

export default meta;

const renderParagraphs = (paragraphs: string[]) => (
  <div className="flex flex-col gap-4">
    {paragraphs.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}
  </div>
);

export const LongContent: TStory = {
  args: {
    children: renderParagraphs(LOREM_IPSUM),
    containerClasses: "",
    maxHeight: 200,
  },
};

export const ShortContent: TStory = {
  args: {
    children: renderParagraphs(LOREM_IPSUM.slice(0, 1)),
    containerClasses: "",
    maxHeight: 200,
  },
};

export const Bordered: TStory = {
  args: {
    children: renderParagraphs(LOREM_IPSUM),
    containerClasses: "p-4 border border-border-light rounded-xl",
    maxHeight: 200,
  },
};
