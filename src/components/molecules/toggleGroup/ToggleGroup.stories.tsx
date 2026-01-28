import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { ToggleGroup } from "./ToggleGroup";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    onValueChange: { control: false },
    value: { control: false },
  },
} satisfies Meta<typeof ToggleGroup>;
type TStory<ToggleId extends string> = StoryObj<typeof ToggleGroup<ToggleId>>;

export default meta;

const useToggleGroupRender = <ToggleId extends string>({ toggles, ...props }: React.ComponentProps<typeof ToggleGroup<ToggleId>>) => {
  const [value, setValue] = useState<ToggleId>(toggles[0].id);
  const changeValue = (newValue: ToggleId) => setValue(newValue);

  return <ToggleGroup {...props} toggles={toggles} onValueChange={changeValue} value={value} />;
};

type TPageHeaderToggleId = "cases" | "events" | "about";

export const CollectionPageHeader: TStory<TPageHeaderToggleId> = {
  args: {
    buttonClasses: "",
    buttonSize: "large",
    groupClasses: "",
    toggles: [{ id: "cases" }, { id: "events", label: "Procedural history" }, { id: "about" }],
  },
  render: useToggleGroupRender,
};
