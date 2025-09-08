import { Meta, StoryObj } from "@storybook/nextjs";

import { Columns } from "@/components/atoms/columns/Columns";

import { IProps, Section } from "./Section";

const meta = {
  title: "Molecules/Section",
  component: Section,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Section>;
type TStory = StoryObj<typeof Section>;

export default meta;

const useSectionContext = ({ children, ...props }: IProps) => (
  <Columns>
    <main className="cols-3:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid gap-6">
      <Section {...props}>
        <div className="bg-emerald-100 min-h-[300px]">Content</div>
      </Section>
    </main>
  </Columns>
);

export const WithTitle: TStory = {
  args: {
    id: "with-title",
    title: "Targets",
    count: 30,
  },
  render: useSectionContext,
};

export const WithoutTitle: TStory = {
  args: {
    id: "without-title",
  },
  render: useSectionContext,
};
