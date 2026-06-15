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
    size: "medium",
  },
  render: useInputContext,
};

export const IconRight: TStory = {
  args: {
    clearable: false,
    icon: <Search size={16} />,
    iconOnLeft: false,
    placeholder: "Search",
    size: "medium",
  },
  render: useInputContext,
};

export const IconLeft: TStory = {
  args: {
    clearable: false,
    icon: <Plus size={16} />,
    iconOnLeft: true,
    placeholder: "Add...",
    size: "medium",
  },
  render: useInputContext,
};

export const Sizes: TStory = {
  args: {
    clearable: true,
    placeholder: "Type something",
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} size="small" placeholder="Small size" />
      <Input {...args} size="medium" placeholder="Medium size" />
      <Input {...args} size="large" placeholder="Large size" />
    </div>
  ),
};
