import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { PageHeader } from "./PageHeader";

const meta = {
  title: "Organisms/PageHeader",
  component: PageHeader,
  argTypes: {},
} satisfies Meta<typeof PageHeader>;
type TStory<Tab extends string = string> = StoryObj<typeof PageHeader<Tab>>;

export default meta;

export const FamilyPage: TStory = {
  args: {
    dark: false,
    title:
      "Equatorial Guinea Long-Term Low-Emission Development Strategy. LT-LEDS1; Strategy for a Just Transition in Equatorial Guinea and its Gender-Responsive Investment Plan. 2025-2035",
    metadata: [
      {
        label: "Date",
        value: "2025",
      },
      {
        label: "Geography",
        value: "Equatorial Guinea",
      },
      {
        label: "Part of",
        value: "Equatorial Guinea's Long-Term Strategies (LT-LEDS)",
      },
    ],
  },
};

type TCollectionTab = "about" | "cases" | "events";

export const CollectionPage: TStory<TCollectionTab> = {
  args: {
    dark: true,
    title: "Climate United Fund v. Citibank, N.A.",
    tabs: [{ id: "cases" }, { id: "events" }, { id: "about" }],
  },
  render: ({ dark, title, tabs }: React.ComponentProps<typeof PageHeader<TCollectionTab>>) => {
    const [currentTab, setCurrentTab] = useState<TCollectionTab>("cases");
    const handleChange = (newTab: TCollectionTab) => setCurrentTab(newTab);

    return <PageHeader<TCollectionTab> title={title} dark={dark} tabs={tabs} currentTab={currentTab} onTabChange={handleChange} />;
  },
};
