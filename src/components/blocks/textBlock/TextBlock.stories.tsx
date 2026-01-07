import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextBlock } from "./TextBlock";

const meta = {
  title: "Blocks/TextBlock",
  component: TextBlock,
  argTypes: {
    children: { control: false },
    maxHeight: { control: "number" },
  },
} satisfies Meta<typeof TextBlock>;
type TStory = StoryObj<typeof TextBlock>;

export default meta;

export const Default: TStory = {
  args: {
    block: "debug",
    children: (
      <div
        className="text-content"
        dangerouslySetInnerHTML={{
          __html: `<p>The National Energy and Climate (ENCP) Plan is a ten-year integrated document mandated by the European Union to each of its member states in order for the EU to meet its overall greenhouse gases emissions targets. Following feedback from an EU-wide assessment of draft National Energy and Climate Plan (NECP) submissions, EU members are required to submit updated final NECPs for the period 2021-2030.</p>\n<p>The key objectives outlined in the plan are: 1) overall reduction of greenhouse gas emissions; and 2) increasing the share of renewable energy sources in the gross final energy consumption and energy efficiency, expressed as consumption of primary energy and direct consumption of energy. Different measures concerning decarbonisation, energy efficiency and security are implemented in the electricity, agriculture, building construction, heating, cooling and transport sectors. The plan aims for a 62% reduction in ETS emissions by 2030 relative to 2005, and a 42.5% renewable share of gross final energy consumption by 2030.</p>`,
        }}
      />
    ),
    maxHeight: 120,
  },
};
