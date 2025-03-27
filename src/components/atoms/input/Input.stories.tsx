import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { iconNames } from "@/components/atoms/icon/Icon";

import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    icon: {
      control: "select",
      options: iconNames,
    },
    onClear: { control: false },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Input>;
type Story = StoryObj<typeof Input>;

export default meta;

const useInputContext = ({ ...props }) => {
  const [value, setValue] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value);
  const handleClear = () => setValue("");

  return <Input value={value} onChange={handleChange} onClear={handleClear} {...props} />;
};

export const Default: Story = {
  args: {},
  render: useInputContext,
};

export const Clearable: Story = {
  args: {
    clearable: true,
    icon: undefined,
    iconOnLeft: false,
    placeholder: "Type something",
    size: "medium",
  },
  render: useInputContext,
};

export const IconRight: Story = {
  args: {
    clearable: false,
    icon: "search",
    iconOnLeft: false,
    placeholder: "Search",
    size: "medium",
  },
  render: useInputContext,
};

export const IconLeft: Story = {
  args: {
    clearable: false,
    icon: "add",
    iconOnLeft: true,
    placeholder: "Add...",
    size: "medium",
  },
  render: useInputContext,
};
