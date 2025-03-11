import { Meta, StoryObj } from "@storybook/react";

import { Icon, iconNames } from "./Icon";

const meta = {
  title: "New/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { control: "color" },
    height: { control: "text" },
    width: { control: "text" },
    name: {
      control: "select",
      options: iconNames,
    },
  },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof Icon>;
export default meta;

export const AllIcons: Story = {
  args: {
    color: "#505050",
    height: "40",
    width: "40",
  },
  argTypes: {
    name: { control: false },
  },
  render: ({ color, height, width }) => (
    <div className="grid grid-cols-6 gap-y-10">
      {iconNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon color={color} name={name} height={height} width={width} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Primary: Story = {
  args: {
    color: "#505050",
    name: "close",
    height: "16",
    width: "16",
  },
};
