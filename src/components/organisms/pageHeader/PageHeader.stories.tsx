import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { IPageHeaderTabsProps, PageHeader } from "./PageHeader";

const meta = {
  title: "Organisms/Sections/PageHeader",
  component: PageHeader,
  argTypes: {},
} satisfies Meta<typeof PageHeader>;
type TStory<Tab extends string = string> = StoryObj<typeof PageHeader<Tab>>;

export default meta;

export const FamilyPage: TStory = {
  args: {
    coloured: false,
    label: "UNFCCC Submission",
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

type CollectionTab = "about" | "cases" | "events";

const useTabsRender = ({ ...props }: IPageHeaderTabsProps<CollectionTab>) => {
  const [currentTab, setCurrentTab] = useState<CollectionTab>("cases");
  const handleChange = (newTab: CollectionTab) => setCurrentTab(newTab);

  return <PageHeader<CollectionTab> currentTab={currentTab} onTabChange={handleChange} {...props} />;
};

export const CollectionPage: TStory<CollectionTab> = {
  args: {
    coloured: true,
    label: "Collection",
    title: "Climate United Fund v. Citibank, N.A.",
    tabs: [{ tab: "cases" }, { tab: "events" }, { tab: "about" }],
  },
  render: useTabsRender,
};
