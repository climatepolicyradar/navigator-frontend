import { Meta, StoryObj } from "@storybook/nextjs";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";

import { TProps, Section } from "./Section";

const meta = {
  title: "Molecules/Section",
  component: Section,
  argTypes: {
    children: { control: false },
    wide: { control: "boolean" },
  },
  render: ({ children, ...props }: TProps) => (
    <FiveColumns>
      <div className="col-start-1 cols5-4:col-end-3 -col-end-1" />
      <main className="pb-8 grid grid-cols-subgrid gap-y-8 col-start-1 -col-end-1 cols5-4:col-start-3">
        <Section {...props}>
          <div className="bg-emerald-50 min-h-[100px]">Content</div>
        </Section>
      </main>
    </FiveColumns>
  ),
} satisfies Meta<typeof Section>;
type TStory = StoryObj<typeof Section>;

export default meta;

export const WithTitle: TStory = {
  args: {
    id: "with-title",
    title: "Targets",
    count: 30,
    wide: false,
  },
};

export const WithoutTitle: TStory = {
  args: {
    block: "debug",
    wide: false,
  },
};

export const Wide: TStory = {
  args: {
    block: "debug",
    wide: true,
  },
};
