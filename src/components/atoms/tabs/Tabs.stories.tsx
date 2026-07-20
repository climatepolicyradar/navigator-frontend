import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "lucide-react";
import { useState } from "react";

import { Tabs } from "./Tabs";

const meta = {
  title: "Atoms/Tabs",
  component: Tabs,
  argTypes: {
    onValueChange: { control: false },
    value: { control: false },
  },
} satisfies Meta<typeof Tabs>;
type TStory<TabId extends string> = StoryObj<typeof Tabs<TabId>>;

export default meta;

const useTabsRender = <TabId extends string>({ tabs, ...props }: React.ComponentProps<typeof Tabs<TabId>>) => {
  const [value, setValue] = useState<TabId>(tabs[0].id);
  const changeValue = (newValue: TabId) => setValue(newValue);

  return <Tabs {...props} tabs={tabs} onValueChange={changeValue} value={value} />;
};

type TPrincipalPageTabId = "about" | "search";

export const Default: TStory<TPrincipalPageTabId> = {
  args: {
    tabs: [
      { id: "about", label: "About" },
      {
        id: "search",
        label: (
          <>
            <Search size={20} />
            Search in documents
          </>
        ),
      },
    ],
  },
  render: useTabsRender,
};

export const WithCount: TStory<TPrincipalPageTabId> = {
  args: {
    tabs: [
      { id: "about", label: "About" },
      {
        id: "search",
        count: 23,
        label: (
          <>
            <Search size={20} />
            Search in documents
          </>
        ),
      },
    ],
  },
  render: useTabsRender,
};

export const WithPanels: TStory<TPrincipalPageTabId> = {
  args: {
    panelClassName: "px-8 py-6",
    tabs: [
      { id: "about", label: "About", panel: "About panel content." },
      {
        id: "search",
        count: 23,
        label: (
          <>
            <Search size={20} />
            Search in documents
          </>
        ),
        panel: "Search in documents panel content.",
      },
    ],
  },
  render: useTabsRender,
};
