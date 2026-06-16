import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
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

export const Placeholder: TStory = {
  args: {
    placeholder: "Type something...",
  },
  render: useInputContext,
};
