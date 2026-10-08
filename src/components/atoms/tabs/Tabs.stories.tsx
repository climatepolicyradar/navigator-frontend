import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "lucide-react";
import { ReactNode, useState } from "react";

import { IconHighlights } from "@/components/fragments/icons/IconHighlights";

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

const banner: ReactNode = (
  <div className="px-8 py-4 flex gap-2 items-center bg-bg-attention text-base text-text-primary font-normal leading-5">
    <IconHighlights variant="solid" />
    <span>Switch tab to search for specific passages within this case</span>
  </div>
);

export const WithBanner: TStory<TPrincipalPageTabId> = {
  args: {
    panelClassName: "px-8 py-6",
    tabs: [
      { id: "about", label: "About", panel: "About panel content." },
      {
        id: "search",
        banner,
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

export const Sticky: TStory<TPrincipalPageTabId> = {
  args: {
    className: "top-0",
    panelClassName: "px-8 py-6",
    sticky: true,
    tabs: [
      { id: "about", label: "About", panel: <div className="h-[200vh]">Scroll down - the tabs stay at the top.</div> },
      {
        id: "search",
        banner,
        label: (
          <>
            <Search size={20} />
            Search in documents
          </>
        ),
        panel: <div className="h-[200vh]">Search in documents panel content.</div>,
      },
    ],
  },
  render: useTabsRender,
};
