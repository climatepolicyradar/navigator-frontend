import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MetadataBlock } from "./MetadataBlock";

const meta = {
  title: "Blocks/MetadataBlock",
  component: MetadataBlock,
  argTypes: {
    title: { control: "text" },
    metadata: { control: false },
  },
} satisfies Meta<typeof MetadataBlock>;

type TStory = StoryObj<typeof MetadataBlock>;

export default meta;

const metadataExample = [
  { label: "Filing year", value: "2025" },
  {
    label: "Geography",
    value: (
      <a href="" className="underline">
        United States
      </a>
    ),
  },
  {
    label: "Principal law",
    value: (
      <div className="grid">
        <span>Article I (U.S. Constitution)</span>
        <span>Administrative Procedure Act (APA)</span>
        <span>State Law—Conversion</span>
        <span>Take Care Clause</span>
        <span>Separation of Powers Doctrine</span>
        <span>Antideficiency Act</span>
        <span>Inflation Reduction Act of 2022</span>
        <span>Spending Clause</span>
        <span>Appropriations Clause</span>
        <span>Replevin</span>
        <span>Appointments Clause</span>
        <span>Impoundment Control Act</span>
        <span>Uniform Grant Guidance Regulations</span>
        <span>Legislative Vesting Clause</span>
        <span>Fifth Amendment—Due Process</span>
        <span>Contract Law</span>
      </div>
    ),
  },
];

export const Default: TStory = {
  args: {
    title: "About this case",
    metadata: metadataExample,
  },
};
