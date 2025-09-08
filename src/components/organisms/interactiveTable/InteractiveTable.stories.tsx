import { Meta, StoryObj } from "@storybook/nextjs";

import { InteractiveTable, IProps, TInteractiveTableCell } from "./InteractiveTable";

const meta = {
  title: "Organisms/InteractiveTable",
  component: InteractiveTable,
  argTypes: {},
} satisfies Meta<typeof InteractiveTable>;
type TStory<ColumnKey extends string> = StoryObj<typeof InteractiveTable<ColumnKey>>;

export default meta;

/* Generic */

type TWainwrightColumns = "height" | "link" | "region" | "summited" | "wainwright";
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
        fraction: 2,
      },
      {
        id: "height",
      },
      {
        id: "region",
        tooltip: (
          <div className="w-[200px]">
            Which of Alfred Wainwright's books the Wainwright features in. The series of 7 books divides the Lakeland Fells by geographic region.
          </div>
        ),
        fraction: 2,
        sortable: false,
      },
      {
        id: "link",
        name: "WalkLakes",
        sortable: false,
      },
      {
        id: "summited",
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
          summited: {
            display: "23/05/2025",
            value: "2025-05-23T10:24:00.000Z",
          },
        },
      },
      {
        id: "scafell-pike",
        cells: {
          wainwright: "Scafell Pike",
          region: "The Southern Fells",
          height: 978,
          link: linkToCell("https://www.walklakes.co.uk/hill_2359.html"),
          summited: null,
        },
      },
      {
        id: "skiddaw",
        cells: {
          wainwright: "Skiddaw",
          region: "The Northern Fells",
          height: 931,
          link: linkToCell("https://www.walklakes.co.uk/hill_2319.html"),
          summited: {
            display: "20/04/2024",
            value: "2024-04-20T10:32:00.000Z",
          },
        },
      },
      {
        id: "high-street",
        cells: {
          wainwright: "High Street",
          region: "The Far Eastern Fells",
          height: 828,
          link: linkToCell("https://www.walklakes.co.uk/hill_2528.html"),
          summited: {
            display: "26/10/2024",
            value: "2024-10-26T11:24:00.000Z",
          },
        },
      },
    ],
    maxRows: 0,
    tableClasses: "min-w-[650px]",
    showValues: false,
  },
};

/* Cell styling */

export const CellStyling: TStory<TWainwrightColumns> = {
  args: {
    ...Generic.args,
    columns: Generic.args.columns.map((column) => {
      if (column.id !== "height") return column;
      return { ...column, classes: "bg-amber-50" };
    }),
    rows: Generic.args.rows.map((row) => {
      if (row.id !== "skiddaw") return row;
      return { ...row, classes: "bg-green-50" };
    }),
  },
};
