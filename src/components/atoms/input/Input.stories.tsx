import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    icon: { control: false },
    onClear: { control: false },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Input>;
type TStory = StoryObj<typeof Input>;

export default meta;

const useInputContext = ({ ...props }: React.ComponentProps<typeof Input>) => {
  const [value, setValue] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value);
  const handleClear = () => setValue("");

  return <Input value={value} onChange={handleChange} onClear={handleClear} {...props} />;
};

export const Default: TStory = {
  args: {},
  render: useInputContext,
};

export const Clearable: TStory = {
  args: {
    clearable: true,
    placeholder: "Type something",
  },
  render: useInputContext,
};

export const IconRight: TStory = {
  args: {
    clearable: false,
    icon: <Search size={14} />,
    iconSide: "right",
    placeholder: "Search",
  },
  render: useInputContext,
};

export const IconLeft: TStory = {
  args: {
    clearable: false,
    icon: <Plus size={14} />,
    iconSide: "left",
    placeholder: "Add...",
  },
  render: useInputContext,
};
