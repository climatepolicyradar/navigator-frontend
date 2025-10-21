import { Meta, StoryObj } from "@storybook/nextjs";

import { GeographyLink } from "./GeographyLink";

const meta = {
  title: "Molecules/GeographyLink",
  component: GeographyLink,
  parameters: { layout: "centered" },
  argTypes: {},
  render: (props) => (
    <div className="text-sm text-gray-700">
      <GeographyLink {...props} />
    </div>
  ),
} satisfies Meta<typeof GeographyLink>;
type TStory = StoryObj<typeof GeographyLink>;

export default meta;

export const Country: TStory = {
  args: {
    code: "USA",
    name: "United States",
    slug: "united-states-of-america",
  },
};

export const Subdivision: TStory = {
  args: {
    code: "US-WA",
    name: "Washington",
    slug: "washington",
  },
};

export const International: TStory = {
  args: {
    code: "XAB",
    name: "International",
  },
};
