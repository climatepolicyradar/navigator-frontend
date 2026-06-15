import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LucideInfo } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { LOREM_IPSUM } from "@/constants/stories";

import { Drawer } from "./Drawer";

const meta = {
  title: "Atoms/DrawerNew",
  component: Drawer,
  argTypes: {
    children: { control: false },
    direction: {
      control: "select",
      options: ["right", "left", "top", "bottom"],
    },
  },
} satisfies Meta<typeof Drawer>;
type TStory = StoryObj<typeof Drawer>;

export default meta;

const ControlledDrawer = (args: React.ComponentProps<typeof Drawer>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Right: TStory = {
  render: (args) => <ControlledDrawer {...args} />,
  args: {
    title: "Basic drawer",
    children: <p>This is a basic drawer. Use the controls to change its direction.</p>,
    direction: "right",
  },
};

const GenericDrawer = (args: React.ComponentProps<typeof Drawer>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Scrolling: TStory = {
  render: (args) => <GenericDrawer {...args} />,
  args: {
    title: "Scrolling drawer",
    children: (
      <div className="flex flex-col gap-4">
        {LOREM_IPSUM.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    ),
  },
};

const NestedDrawerContent = () => {
  const [nestedOpen, setNestedOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const items = ["Item one", "Item two", "Item three"];

  return (
    <>
      <p className="text-sm text-neutral-600 mb-2">Click an item to open a nested drawer.</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <button
              className="w-full text-left text-sm py-2 px-3 rounded hover:bg-neutral-100"
              onClick={() => {
                setSelectedItem(item);
                setNestedOpen(true);
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
      {/* Nested drawer must live inside the parent Popup so Base UI can track nesting */}
      <Drawer open={nestedOpen} onOpenChange={setNestedOpen} direction="right" title={selectedItem ?? ""}>
        <p className="text-sm">You opened: {selectedItem}</p>
      </Drawer>
    </>
  );
};

export const Nested: TStory = {
  render: (args) => <GenericDrawer {...args} />,
  args: {
    title: "Parent drawer",
    children: <NestedDrawerContent />,
  },
};

export const CustomTitle: TStory = {
  render: (args) => <GenericDrawer {...args} />,
  args: {
    title: (
      <span className="flex items-center gap-2">
        <LucideInfo width={18} height={18} className="text-inky-blue shrink-0" />
        Custom title with icon
      </span>
    ),
  },
};
