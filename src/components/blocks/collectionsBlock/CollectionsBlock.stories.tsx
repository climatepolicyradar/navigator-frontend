import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { TCollectionPublicWithFamilies } from "@/types";

import { CollectionsBlock } from "./CollectionsBlock";

const meta = {
  title: "Blocks/CollectionsBlock",
  component: CollectionsBlock,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    collections: { control: false },
  },
  render: ({ ...props }) => (
    <FiveColumns>
      <CollectionsBlock {...props} />
    </FiveColumns>
  ),
} satisfies Meta<typeof CollectionsBlock>;
type TStory = StoryObj<typeof CollectionsBlock>;

export default meta;

const COLLECTIONS = [
  {
    import_id: "UNFCCC.collection.510.0",
    title: "Ukraine's Nationally Determined Contributions",
    families: [
      {
        import_id: "UNFCCC.family.1509.0",
        title: "Ukraine Nationally Determined Contribution. NDC1 (Updated submission)",
      },
      {
        import_id: "UNFCCC.family.1508.0",
        title: "Ukraine Nationally Determined Contribution. NDC1 (Archived)",
      },
      {
        import_id: "UNFCCC.family.i00006599.n0000",
        title: "Ukraine Nationally Determined Contribution. NDC3.0",
      },
    ],
  },
] as unknown as TCollectionPublicWithFamilies[];

export const Single: TStory = {
  args: {
    collections: COLLECTIONS,
  },
};

export const Multiple: TStory = {
  args: {
    collections: [COLLECTIONS, COLLECTIONS].flat(),
  },
};
