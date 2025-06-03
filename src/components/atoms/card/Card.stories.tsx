import { Meta, StoryObj } from "@storybook/react";
import { LuCopy } from "react-icons/lu";

import { Card } from "./Card";

const meta = {
  title: "Atoms/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Card>;
type TStory = StoryObj<typeof Card>;

export default meta;

const render = ({ ...props }) => (
  <div className="max-w-[400px]">
    <Card {...props} />
  </div>
);

const children = (
  <>
    <div className={`mb-4 flex justify-between opacity-80`}>
      <span className="font-medium text-[13px]">Page 16</span>
      <LuCopy height="16" width="16" />
    </div>
    <p className="font-normal text-[15px]">
      (PM2.5), the pollutant most associated with negative health impacts. The impact quantified here are premature deaths associated with PM2.5
      exposure, although air pollution has a much wider effect on health, including non-fatal effects on the respiratory and cardiovascular systems.
      In Nigeria in 2010, fine particulate matter exposure was associated with about 61,000 premature deaths with the most affected being children of
      less than 5 years of age. Environmental effects are defined as effects on crops and forests, while climate effects are defined as global warming
      or cooling of the atmosphere.
    </p>
  </>
);

export const Outlined: TStory = {
  args: {
    children,
    className: "",
    color: "brand",
    variant: "outlined",
  },
  render,
};

export const Solid: TStory = {
  args: {
    children,
    className: "",
    color: "brand",
    variant: "solid",
  },
  render,
};
