import { Meta, StoryObj } from "@storybook/react";

import { Columns } from "@/components/atoms/columns/Columns";

import { IProps, Section } from "./Section";

const meta = {
  title: "Molecules/Section",
  component: Section,
  argTypes: {},
} satisfies Meta<typeof Section>;
type TStory = StoryObj<typeof Section>;

export default meta;

const useSectionContext = ({ children, ...props }: IProps) => (
  <Columns>
    <main className="cols-3:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid gap-6">
      <Section {...props}>{children}</Section>
    </main>
  </Columns>
);

export const Minimal: TStory = {
  args: {
    title: "Minimal",
    children: <div className="bg-emerald-200 min-h-[300px]">Content</div>,
  },
  render: useSectionContext,
};

export const FullyFeatured: TStory = {
  args: {
    title: "Topics identified in this policy",
    titleBadge: "Experimental",
    controls: <div className="flex justify-center items-center bg-blue-100 min-h-[50px] w-[200px]">Controls</div>,
    children: <div className="flex justify-center items-center bg-blue-50 mt-6 min-h-[300px]">Content</div>,
    explanation: (
      <p>
        These topics were automatically detected in this policy by our responsible machine learning process. This is a new feature, actively being
        worked on, accuracy is not 100%.{" "}
        <a href="#" className="inline-block underline">
          Learn more
        </a>
      </p>
    ),
  },
  render: useSectionContext,
};
