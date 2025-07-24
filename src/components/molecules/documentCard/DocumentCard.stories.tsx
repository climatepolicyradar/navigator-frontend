import { Meta, StoryObj } from "@storybook/react";

import { DocumentCard } from "./DocumentCard";

const meta = {
  title: "Molecules/DocumentCard",
  component: DocumentCard,
  argTypes: {},
} satisfies Meta<typeof DocumentCard>;
type TStory = StoryObj<typeof DocumentCard>;

export default meta;

export const PolicyDocument: TStory = {
  args: {
    document: {
      import_id: "CCLW.document.i00004157.n0000",
      variant: "Original Language",
      slug: "croatia-final-updated-necp-annex-1-2021-2030_1de4",
      title: "Croatia - Final Updated NECP (Annex 1) 2021 - 2030",
      md5_sum: "b0ee9b3d4c26e1b3d40d00d28761e843",
      cdn_object:
        "https://cdn.climatepolicyradar.org/navigator/HRV/2025/croatia-final-updated-national-energy-and-climate-plan-necp-2021-2030_b0ee9b3d4c26e1b3d40d00d28761e843.pdf",
      source_url:
        "https://commission.europa.eu/document/download/93d8e8a1-74d0-4e47-b0f8-99329e023b1b_en?filename=Croatia%20-%20Final%20Updated%20NECP%20%28Annex%201%29%202021%20-%202030.pdf",
      content_type: "application/pdf",
      language: "eng",
      languages: ["eng"],
      document_type: "Plan",
      document_role: "ANNEX",
    },
    languages: {
      eng: "English",
    },
    matches: 12,
  },
};
