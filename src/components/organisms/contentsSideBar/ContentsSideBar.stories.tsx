import { Meta, StoryObj } from "@storybook/react";

import { Columns } from "@/components/atoms/columns/Columns";
import { FAMILY_PAGE_SIDE_BAR_ITEMS } from "@/constants/sideBarItems";
import { LOREM_IPSUM } from "@/constants/stories";

import { ContentsSideBar } from "./ContentsSideBar";

const meta = {
  title: "Organisms/ContentsSideBar",
  component: ContentsSideBar,
  argTypes: {
    containerClasses: { control: "text" },
    stickyClasses: { control: "text" },
  },
} satisfies Meta<typeof ContentsSideBar>;
type TStory = StoryObj<typeof ContentsSideBar>;

export default meta;

export const InIsolation: TStory = {
  args: {
    items: FAMILY_PAGE_SIDE_BAR_ITEMS,
    containerClasses: "",
    stickyClasses: "",
  },
};

export const OnAPage: TStory = {
  name: "On a Page",
  args: {
    items: FAMILY_PAGE_SIDE_BAR_ITEMS,
    containerClasses: "",
    stickyClasses: "",
  },
  render: ({ ...props }) => (
    <Columns>
      <ContentsSideBar {...props} />
      <div className="flex flex-col gap-8 cols-3:col-span-2 cols-4:col-span-3">
        {FAMILY_PAGE_SIDE_BAR_ITEMS.map((item) => (
          <section id={item.id} key={item.id}>
            <h1 className="text-2xl font-bold mb-4">{item.display}</h1>
            {LOREM_IPSUM.map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Columns>
  ),
};
