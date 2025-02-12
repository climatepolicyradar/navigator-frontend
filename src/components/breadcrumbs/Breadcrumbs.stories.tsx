import { Meta, StoryObj } from "@storybook/react";
import { BreadCrumbs } from "./Breadcrumbs";

const meta = {
  title: "Old/BreadCrumbs",
  component: BreadCrumbs,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BreadCrumbs>;
type Story = StoryObj<typeof BreadCrumbs>;

export default meta;

export const SearchResults: Story = {
  args: {
    label: "Search results",
  },
};

export const Geography: Story = {
  args: {
    label: "United Kingdom",
  },
};

export const Document: Story = {
  args: {
    category: {
      href: "/search",
      label: "Search results",
    },
    geography: {
      href: "/geographies/france",
      label: "France",
    },
    label: "Order relating to the conditions for converting combustion engine vehicles into battery or fuel cell electric engines",
  },
};
