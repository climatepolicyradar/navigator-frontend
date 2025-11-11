import { Meta, StoryObj } from "@storybook/nextjs";

import { FiveColumns } from "./FiveColumns";

const meta = {
  title: "Atoms/Columns/FiveColumns",
  component: FiveColumns,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof FiveColumns>;
type TStory = StoryObj<typeof FiveColumns>;

export default meta;

export const Columns: TStory = {
  render: () => (
    <FiveColumns className="h-100 overflow-hidden">
      {Array(10)
        .fill(null)
        .map((_value, index) => (
          <div key={index} className="bg-red-300 h-100" />
        ))}
    </FiveColumns>
  ),
};

export const Template: TStory = {
  render: () => (
    <FiveColumns>
      <div className="h-15 bg-green-300 col-start-1 -col-end-1">header</div>
      <div className="h-15 bg-blue-300 col-span-2">sidebar</div>
      <div className="h-15 bg-purple-300 col-start-1 cols-2:col-start-3 -col-end-1">main</div>
      <div className="h-15 bg-red-300 col-start-1 -col-end-1">footer</div>
    </FiveColumns>
  ),
};
