import { Meta, StoryObj } from "@storybook/react";
import { LucideSearch } from "lucide-react";
import { useState } from "react";

import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    Icon: { control: false },
    onClear: { control: false },
    onIconClick: { control: false },
  },
} satisfies Meta<typeof Input>;
type TStory = StoryObj<typeof Input>;

export default meta;

const useInputContext = ({ ...props }) => {
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
    containerClasses: "",
    inputClasses: "",
  },
  render: useInputContext,
};

export const Icon: TStory = {
  args: {
    clearable: false,
    containerClasses: "",
    Icon: LucideSearch,
    onIconClick: (value) => alert(`Searched for: ${value}`),
    placeholder: "Search...",
  },
  render: useInputContext,
};
