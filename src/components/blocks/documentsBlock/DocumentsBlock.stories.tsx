import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";

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
    family: FAMILY_NEW_STUB,
  },
};

export const WithAPlaceholderDocument: TStory = {
  args: {
    ...Default.args,
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
