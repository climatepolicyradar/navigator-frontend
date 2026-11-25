import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { TCollectionPublicWithFamilies, TFamilyPublic } from "@/types";

import { CollectionsBlock } from "./CollectionsBlock";

const meta = {
  title: "Blocks/CollectionsBlock",
  component: CollectionsBlock,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    family: { control: false },
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

const FAMILY = {
  import_id: "UNFCCC.family.i00006599.n0000",
  slug: "ukraine-nationally-determined-contribution-ndc3-0",
  title: "Ukraine Nationally Determined Contribution. NDC3.0",
} as unknown as TFamilyPublic;

const COLLECTION_NDCS = {
  import_id: "UNFCCC.collection.510.0",
  title: "Ukraine's Nationally Determined Contributions",
  description: "Nationally Determined Contributions submitted by Ukraine to the UNFCCC.",
  families: [
    {
      import_id: "UNFCCC.family.1509.0",
      slug: "ukraine-nationally-determined-contribution-ndc1-updated-submission",
      title: "Ukraine Nationally Determined Contribution. NDC1 (Updated submission)",
    },
    {
      import_id: "UNFCCC.family.1508.0",
      slug: "ukraine-nationally-determined-contribution-ndc1-archived",
      title: "Ukraine Nationally Determined Contribution. NDC1 (Archived)",
    },
    FAMILY,
  ],
} as unknown as TCollectionPublicWithFamilies;

const COLLECTION_REPORTS = {
  import_id: "UNFCCC.collection.511.0",
  title: "Ukraine's Biennial Transparency Reports",
  families: [
    {
      import_id: "UNFCCC.family.1600.0",
      slug: "ukraine-biennial-transparency-report-btr1",
      title: "Ukraine Biennial Transparency Report. BTR1",
    },
    FAMILY,
  ],
} as unknown as TCollectionPublicWithFamilies;

const COLLECTION_ONE_DOCUMENT = {
  import_id: "UNFCCC.collection.512.0",
  title: "Ukraine's Long-Term Strategies",
  families: [FAMILY],
} as unknown as TCollectionPublicWithFamilies;

export const Collection: TStory = {
  args: {
    family: FAMILY,
    collections: [COLLECTION_NDCS],
  },
};

export const Collections: TStory = {
  args: {
    family: FAMILY,
    collections: [COLLECTION_NDCS, COLLECTION_REPORTS],
  },
};

export const CollectionWithOneDocument: TStory = {
  args: {
    family: FAMILY,
    collections: [COLLECTION_ONE_DOCUMENT],
  },
};
