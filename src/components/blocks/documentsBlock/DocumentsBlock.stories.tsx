import { Meta, StoryObj } from "@storybook/nextjs";

import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";
import { TFamilyDocument, TMatchedFamily } from "@/types";

import { DocumentsBlock } from "./DocumentsBlock";

const meta = {
  title: "Blocks/DocumentsBlock",
  component: DocumentsBlock,
  argTypes: {
    matchesStatus: { control: "select", options: ["loading", "success"] },
  },
} satisfies Meta<typeof DocumentsBlock>;
type TStory = StoryObj<typeof DocumentsBlock>;

export default meta;

export const WithoutMatches: TStory = {
  args: {
    family: FAMILY_NEW_STUB,
    matchesFamily: null,
    matchesStatus: "success",
    showMatches: false,
    showKnowledgeGraphTutorial: false,
  },
};

const spoofDocumentMatches = (document_slug: string, matches: number) =>
  ({
    document_slug,
    document_passage_matches: new Array(matches).fill({}),
  }) as TFamilyDocument;

export const WithMatches: TStory = {
  args: {
    ...WithoutMatches.args,
    matchesFamily: {
      family_documents: [
        spoofDocumentMatches("district-court-declined-to-stay-proceedings_3889", 21),
        spoofDocumentMatches("juliana-v-united-states-answer_0720", 10),
        spoofDocumentMatches("juliana-v-united-states-reply_f1cf", 47),
      ],
    } as TMatchedFamily,
    showMatches: true,
  },
};

export const WithAPlaceholderDocument: TStory = {
  args: {
    ...WithoutMatches.args,
    family: {
      ...FAMILY_NEW_STUB,
      documents: [
        {
          ...FAMILY_NEW_STUB.documents[0],
          events: [],
        },
      ],
    },
  },
};
