import { Meta, StoryObj } from "@storybook/react";

import { FAMILY_PAGE_STUB } from "@/stubs/familyPageStub";

import { DocumentCard } from "./DocumentCard";

const meta = {
  title: "Molecules/DocumentCard",
  component: DocumentCard,
  argTypes: {},
} satisfies Meta<typeof DocumentCard>;
type TStory = StoryObj<typeof DocumentCard>;

export default meta;

export const UNFCCCSubmission: TStory = {
  name: "UNFCC Submission",
  args: {
    countries: [{ id: 31, display_value: "Hungary", slug: "hungary", value: "HUN", type: "ISO-3166", parent_id: 10 }],
    document: FAMILY_PAGE_STUB.documents[0],
    family: FAMILY_PAGE_STUB,
    matches: 12,
  },
};
