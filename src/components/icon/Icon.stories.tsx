import { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { allIcons, IconName } from "@components/svg/Icons";

const allIconNames = Object.keys(allIcons) as IconName[];

const meta = {
  title: "New/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: {
      control: "select",
      options: allIconNames,
    },
  },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof Icon>;
export default meta;

export const AllIcons: Story = {
  argTypes: {
    name: { control: false },
  },
  render: () => (
    <div className="grid grid-cols-6 gap-y-10">
      {allIconNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} height="40" width="40" />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Primary: Story = {
  args: {
    name: "close",
  },
};
