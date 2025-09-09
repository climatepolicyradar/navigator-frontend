import { Meta, StoryObj } from "@storybook/nextjs";

import { EntityCard } from "./EntityCard";

const meta = {
  title: "Molecules/EntityCard",
  component: EntityCard,
  parameters: { layout: "centered" },
  argTypes: {
    metadata: { control: "object" },
  },
} satisfies Meta<typeof EntityCard>;
type TStory = StoryObj<typeof EntityCard>;

export default meta;

export const Family: TStory = {
  args: {
    href: "#",
    metadata: ["Litigation", "Scotland", "2023"],
    title: "Greenpeace UK and Uplift v. Secretary of State for Energy Security and Net Zero and the North Sea Transition Authority",
  },
};
