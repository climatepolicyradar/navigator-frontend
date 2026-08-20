import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DocumentsFilter } from "./DocumentsFilter";

const meta = {
  title: "Molecules/DocumentsFilter",
  component: DocumentsFilter,
  parameters: { layout: "centered" },
  args: { label: "Documents in this Law", onSelectionChange: () => {} },
  argTypes: {
    onSelectionChange: { control: false },
  },
} satisfies Meta<typeof DocumentsFilter>;
type TStory = StoryObj<typeof DocumentsFilter>;

export default meta;

const documents = [
  { importId: "CCLW.document.1.1", title: "Law for the expansion of renewable energies (Renewable Energy Sources Act - EEG 2017)" },
  { importId: "CCLW.document.1.2", title: "Amendment to the renewable energies law" },
  { importId: "CCLW.document.1.3", title: "Decree on renewable energy sources" },
];

export const AllSelected: TStory = {
  args: {
    documents,
    selectedImportIds: documents.map((document) => document.importId),
  },
};

export const NarrowedToOne: TStory = {
  args: {
    documents,
    selectedImportIds: ["CCLW.document.1.2"],
  },
};
