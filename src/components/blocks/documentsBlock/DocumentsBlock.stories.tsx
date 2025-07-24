import { Meta, StoryObj } from "@storybook/react";

import { FAMILY_PAGE_STUB } from "@/stubs/familyPageStub";

import { DocumentsBlock } from "./DocumentsBlock";

const meta = {
  title: "Blocks/DocumentsBlock",
  component: DocumentsBlock,
  argTypes: {},
} satisfies Meta<typeof DocumentsBlock>;
type TStory = StoryObj<typeof DocumentsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    countries: [{ id: 31, display_value: "Hungary", slug: "hungary", value: "HUN", type: "ISO-3166", parent_id: 10 }],
    family: FAMILY_PAGE_STUB,
    status: "success",
  },
};
