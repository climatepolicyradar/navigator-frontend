import { Meta, StoryObj } from "@storybook/nextjs";
import { LucideInfo } from "lucide-react";

import { Tooltip } from "./Tooltip";

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: false },
    content: { control: "text" },
    side: { control: "select" },
  },
} satisfies Meta<typeof Tooltip>;
type TStory = StoryObj<typeof Tooltip>;

export default meta;

const trigger = <LucideInfo size={16} className="text-text-tertiary" />;

export const Basic: TStory = {
  args: {
    arrow: false,
    children: trigger,
    content: "Hello tooltip!",
    popupClasses: "",
    side: "top",
  },
};

export const Complex: TStory = {
  args: {
    arrow: true,
    children: trigger,
    content: (
      <div className="flex flex-col gap-1">
        <p>
          The annually published Global Climate Risk Index analyses to what extent countries have been affected by the impacts of weather-related loss
          events (storms, floods, heat waves etc.).
        </p>
        <p>
          This data is from the Global Risk Index 2021 published by{" "}
          <a href="https://www.germanwatch.org/en/cri" className="underline">
            German Watch
          </a>
          . Numbers marked with an asterisk (*) are from the Global Risk Index 2020, being the latest available data for that country. This data was
          last updated on this site on 18 September 2023.
        </p>
        <p>
          See the full report published by German Watch{" "}
          <a href="https://www.germanwatch.org/en/19777" className="underline">
            here
          </a>
          .
        </p>
      </div>
    ),
    popupClasses: "w-[350px] p-3 !text-sm text-wrap leading-normal font-normal",
    side: "bottom",
  },
  argTypes: {
    content: { control: false },
  },
};
