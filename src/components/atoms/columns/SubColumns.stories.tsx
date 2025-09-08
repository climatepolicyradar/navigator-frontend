import { Meta, StoryObj } from "@storybook/nextjs";

import { Columns } from "./Columns";
import { SubColumns } from "./SubColumns";

const meta = {
  title: "Atoms/Columns/SubColumns",
  component: SubColumns,
  argTypes: {
    children: { control: false },
    className: { control: "text" },
  },
} satisfies Meta<typeof SubColumns>;
type TStory = StoryObj<typeof SubColumns>;

export default meta;

export const InIsolation: TStory = {
  render: () => (
    <SubColumns>
      <div className="bg-green-100 min-h-[300px]">A</div>
      <div className="bg-green-300 min-h-[300px]">B</div>
      <div className="bg-green-500 min-h-[300px]">C</div>
    </SubColumns>
  ),
};

export const WithinColumns: TStory = {
  render: () => (
    <Columns>
      <div className="bg-teal-100 min-h-[300px]">
        One
        <SubColumns>
          <div className="bg-teal-200 min-h-[300px]">1A</div>
          <div className="bg-teal-300 min-h-[300px]">1B</div>
          <div className="bg-teal-400 min-h-[300px]">1C</div>
        </SubColumns>
      </div>
      <div className="bg-cyan-100 min-h-[300px]">
        2
        <SubColumns>
          <div className="bg-cyan-200 min-h-[300px]">2A</div>
          <div className="bg-cyan-300 min-h-[300px]">2B</div>
          <div className="bg-cyan-400 min-h-[300px]">2C</div>
        </SubColumns>
      </div>
      <div className="bg-sky-100 min-h-[300px]">
        3
        <SubColumns>
          <div className="bg-sky-200 min-h-[300px]">3A</div>
          <div className="bg-sky-300 min-h-[300px]">3B</div>
          <div className="bg-sky-400 min-h-[300px]">3C</div>
        </SubColumns>
      </div>
      <div className="bg-blue-100 min-h-[300px]">
        4
        <SubColumns>
          <div className="bg-blue-200 min-h-[300px]">4A</div>
          <div className="bg-blue-300 min-h-[300px]">4B</div>
          <div className="bg-blue-400 min-h-[300px]">4C</div>
        </SubColumns>
      </div>
    </Columns>
  ),
};
