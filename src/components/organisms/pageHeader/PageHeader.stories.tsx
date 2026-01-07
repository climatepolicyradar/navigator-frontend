import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { IPageHeaderTabsProps, PageHeader } from "./PageHeader";

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

const useTabsRender = ({ ...props }: IPageHeaderTabsProps<TCollectionTab>) => {
  const [currentTab, setCurrentTab] = useState<TCollectionTab>("cases");
  const handleChange = (newTab: TCollectionTab) => setCurrentTab(newTab);

  return <PageHeader<TCollectionTab> currentTab={currentTab} onTabChange={handleChange} {...props} />;
};

export const CollectionPage: TStory<TCollectionTab> = {
  args: {
    dark: true,
    title: "Climate United Fund v. Citibank, N.A.",
    tabs: [{ id: "cases" }, { id: "events" }, { id: "about" }],
  },
  render: useTabsRender,
};
