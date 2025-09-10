import { Meta, StoryObj } from "@storybook/nextjs";

import { Columns } from "@/components/atoms/columns/Columns";
import { getGeographyPageSidebarItems } from "@/constants/sideBarItems";
import { LOREM_IPSUM } from "@/constants/stories";

import { ContentsSideBar, IProps, ISideBarItem } from "./ContentsSideBar";

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

const usePageContext = ({ ...props }: IProps) => (
  <Columns>
    <ContentsSideBar {...props} />
    <div className="flex flex-col gap-8 cols-3:col-span-2 cols-4:col-span-3">
      {props.items.map((item) => (
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
);

export const GeographyPage: TStory = {
  args: {
    items: getGeographyPageSidebarItems({
      isCountry: true,
      legislativeProcess: true,
      metadata: true,
      subdivisions: true,
      targets: true,
    }),
    containerClasses: "",
    stickyClasses: "",
  },
  render: usePageContext,
};

const FAMILY_ITEMS: ISideBarItem[] = [
  {
    id: "section-1",
    display: "Juliana v. United States",
    context: ["Federal Courts", "24-645"],
  },
  {
    id: "section-2",
    display: "Juliana v. United States",
    context: ["Federal Courts", "DB-485790"],
  },
  {
    id: "section-3",
    display: "Juliana v. United States",
    context: ["Federal Courts", "56580-20"],
  },
  {
    id: "section-4",
    display: "In re Juliana",
    context: ["Federal Courts", "DB-485790"],
  },
  {
    id: "section-5",
    display: "United States v. U.S. District Court for the District of Oregon",
    context: ["Federal Courts", "DB-485790"],
  },
];

export const CollectionPage: TStory = {
  args: {
    items: FAMILY_ITEMS,
    containerClasses: "",
    stickyClasses: "",
  },
  render: usePageContext,
};
