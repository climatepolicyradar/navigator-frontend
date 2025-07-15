import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Warning } from "./Warning";

const meta = {
  title: "Molecules/Warning",
  component: Warning,
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Warning>;
type TStory = StoryObj<typeof Warning>;

export default meta;

export const Primary: TStory = {
  args: {
    children: (
      <p>
        The warning component is used to display important information or alerts to users. It can be styled with different variants such as "info" or
        "disclaimer". The component can also be hideable, allowing users to dismiss it and not see it again in the current session.
      </p>
    ),
    variant: "info",
    hideableId: "info-warning-id",
    className: "",
  },
};

export const WarningStory: TStory = {
  name: "Disclaimer variant",
  args: {
    children: (
      <>
        <p>The default variant is "info", but you can also use the "disclaimer" variant to indicate a less critical warning or information.</p>
        <p>If no hideableId is provided, the Warning cannot be dismissed.</p>
      </>
    ),
  },
};
