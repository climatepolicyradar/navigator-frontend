import { Meta, StoryObj } from "@storybook/react/*";
import { SortableTable } from "./SortableTable";

const meta = {
  title: "Molecules/SortableTable",
  component: SortableTable,
} satisfies Meta<typeof SortableTable>;
type Story<ColumnKey extends string> = StoryObj<typeof SortableTable<ColumnKey>>;

export default meta;

type WainwrightColumnKeys = "height" | "region" | "wainwright";

export const Primary: Story<WainwrightColumnKeys> = {
  args: {
    columns: [
      {
        id: "wainwright",
        name: "Wainwright",
        sortable: true,
      },
      {
        id: "region",
        name: "Region",
      },
      {
        id: "height",
        name: "Height",
        sortable: true,
      },
    ],
    defaultSort: {
      key: "height",
      ascending: false,
    },
    rows: [
      {
        wainwright: "Helvellyn",
        region: "The Eastern Fells",
        height: 950,
      },
      {
        wainwright: "Scafell Pike",
        region: "The Southern Fells",
        height: 978,
      },
      {
        wainwright: "Skiddaw",
        region: "The Northern Fells",
        height: 931,
      },
      {
        wainwright: "High Street",
        region: "The Far Eastern Fells",
        height: 828,
      },
    ],
  },
};
