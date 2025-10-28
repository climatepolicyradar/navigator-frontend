import { Meta, StoryObj } from "@storybook/nextjs";

import { FourColumns } from "./FourColumns";

const meta = {
  title: "Atoms/Columns/FourColumns",
  component: FourColumns,
  argTypes: {
    children: { control: false },
    containerClasses: { control: "text" },
    gridClasses: { control: "text" },
  },
} satisfies Meta<typeof FourColumns>;
type TStory = StoryObj<typeof FourColumns>;

export default meta;

export const Columns: TStory = {
  render: () => (
    <FourColumns>
      <div className="bg-amber-100 min-h-[300px]">1</div>
      <div className="bg-amber-300 min-h-[300px]">2</div>
      <div className="bg-amber-500 min-h-[300px]">3</div>
      <div className="bg-amber-700 min-h-[300px]">4</div>
    </FourColumns>
  ),
};

export const SidebarAndMain: TStory = {
  render: () => (
    <FourColumns>
      <aside className="bg-blue-100 min-h-[300px]">Sidebar</aside>
      <main className="bg-blue-200 min-h-[300px] cols-3:col-span-2 cols-4:col-span-3 grid grid-cols-subgrid gap-6">
        <section className="bg-blue-300 h-[150px]">Main A</section>
        <section className="bg-blue-500 h-[150px]">Main B</section>
        <section className="bg-blue-700 h-[150px]">Main C</section>
      </main>
    </FourColumns>
  ),
};
