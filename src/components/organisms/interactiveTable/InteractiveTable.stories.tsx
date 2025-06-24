import { Meta, StoryObj } from "@storybook/react";

import { InteractiveTable, TInteractiveTableCell } from "./InteractiveTable";

const meta = {
  title: "Organisms/InteractiveTable",
  component: InteractiveTable,
  argTypes: {},
} satisfies Meta<typeof InteractiveTable>;
type TStory<ColumnKey extends string> = StoryObj<typeof InteractiveTable<ColumnKey>>;

export default meta;

/* Generic */

type TWainwrightColumns = "height" | "link" | "region" | "wainwright";
const linkToCell = (link: string): TInteractiveTableCell => ({
  display: (
    <a href={link} className="text-text-brand underline">
      View
    </a>
  ),
  value: link,
});

export const Generic: TStory<TWainwrightColumns> = {
  args: {
    columns: [
      {
        id: "wainwright",
        name: "Wainwright",
        sortable: true,
      },
      {
        id: "height",
        name: "Height",
        sortable: true,
      },
      {
        id: "region",
        name: "Region",
      },
      {
        id: "link",
        name: "WalkLakes",
      },
    ],
    defaultSort: {
      column: "height",
      ascending: false,
    },
    rows: [
      {
        id: "helvellyn",
        cells: {
          wainwright: "Helvellyn",
          region: "The Eastern Fells",
          height: 950,
          link: linkToCell("https://www.walklakes.co.uk/hill_2515.html"),
        },
      },
      {
        id: "scafell-pike",
        cells: {
          wainwright: "Scafell Pike",
          region: "The Southern Fells",
          height: 978,
          link: linkToCell("https://www.walklakes.co.uk/hill_2359.html"),
        },
      },
      {
        id: "skiddaw",
        cells: {
          wainwright: "Skiddaw",
          region: "The Northern Fells",
          height: 931,
          link: linkToCell("https://www.walklakes.co.uk/hill_2319.html"),
        },
      },
      {
        id: "high-street",
        cells: {
          wainwright: "High Street",
          region: "The Far Eastern Fells",
          height: 828,
          link: linkToCell("https://www.walklakes.co.uk/hill_2528.html"),
        },
      },
    ],
  },
};

/* Entries */
