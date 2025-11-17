import { Meta, StoryObj } from "@storybook/nextjs";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { TCorpusTypeDictionary } from "@/types";

import { NoteBlock } from "./NoteBlock";

const meta = {
  title: "Blocks/NoteBlock",
  component: NoteBlock,
  argTypes: {},
  render: ({ ...props }) => (
    <FiveColumns>
      <NoteBlock {...props} />
    </FiveColumns>
  ),
} satisfies Meta<typeof NoteBlock>;
type TStory = StoryObj<typeof NoteBlock>;

export default meta;

const CORPUS_TYPES = {
  "Laws and Policies": {
    corpora: [
      {
        corpus_import_id: "CCLW.corpus.i00000001.n0000",
        title: "CCLW national policies",
        image_url: "https://cdn.climatepolicyradar.org/corpora/CCLW.corpus.i00000001.n0000/logo.png",
        text: '<p>          The summary of this document was written by researchers at the <a href="http://lse.ac.uk/grantham" target="_blank"> Grantham Research Institute </a> .           If you want to use this summary, please check <a href="https://www.lse.ac.uk/granthaminstitute/cclw-terms-and-conditions" target="_blank"> terms of use </a> for citation and licensing of third party data.</p>',
      },
    ],
  },
  "Intl. agreements": {
    corpora: [
      {
        corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
        title: "UNFCCC Submissions",
        image_url: "",
        text: '<p>This document was downloaded from the <a href="https://unfccc.int/" target="_blank"> UNFCCC website</a>. Please check <a href="https://unfccc.int/this-site/terms-of-use" target="_blank"> terms of use </a> for citation and licensing of third party data.</p>',
      },
    ],
  },
} as unknown as TCorpusTypeDictionary;

export const WithImage: TStory = {
  args: {
    corpusId: "CCLW.corpus.i00000001.n0000",
    corpusTypes: CORPUS_TYPES,
  },
};

export const WithoutImage: TStory = {
  args: {
    corpusId: "UNFCCC.corpus.i00000001.n0000",
    corpusTypes: CORPUS_TYPES,
  },
};
