import { Meta, StoryObj } from "@storybook/react";

import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";

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
    document: FAMILY_NEW_STUB.documents[0],
    family: FAMILY_NEW_STUB,
    matches: 12,
  },
};
