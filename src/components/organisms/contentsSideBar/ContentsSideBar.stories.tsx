import { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/atoms/label/Badge";

import { ContentsSideBar, ISideBarItem } from "./ContentsSideBar";

const meta = {
  title: "Organisms/ContentsSideBar",
  component: ContentsSideBar,
  argTypes: {},
} satisfies Meta<typeof ContentsSideBar>;
type TStory = StoryObj<typeof ContentsSideBar>;

export default meta;

const items: ISideBarItem[] = [
  {
    id: "section-description",
    display: "Description",
  },
  {
    id: "section-documents",
    display: "Documents",
  },
  {
    id: "section-targets",
    display: "Targets",
  },
  {
    id: "section-index",
    display: "Index",
  },
  {
    id: "section-collection",
    display: "Collection",
  },
  {
    id: "section-related",
    display: "Related",
  },
];

export const InIsolation: TStory = {
  args: {
    items,
  },
};
