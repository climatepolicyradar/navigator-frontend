import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SearchDocument } from "@/api/search";

import { DocumentCard } from "./DocumentCard";

const meta = {
  title: "Molecules/DocumentCard",
  component: DocumentCard,
  parameters: { layout: "centered" },
  args: { onClick: () => {} },
} satisfies Meta<typeof DocumentCard>;
type TStory = StoryObj<typeof DocumentCard>;

export default meta;

const baseDocument: SearchDocument = {
  id: "doc-1",
  title: "National Climate Change Adaptation Strategy",
  description: null,
  labels: [{ type: "category", value: { id: "cat-1", type: "category", value: "Policy" }, count: null, timestamp: null }],
  documents: [],
  items: [],
  attributes: { published_date: "2023-06-15" },
};

export const Default: TStory = {
  args: {
    document: baseDocument,
  },
};

export const WithDescription: TStory = {
  args: {
    document: {
      ...baseDocument,
      description:
        "This strategy outlines the government's approach to managing the impacts of climate change across key sectors including agriculture, water resources, coastal zones, and public health, with a focus on long-term resilience.",
    },
  },
};

export const PrincipalDocument: TStory = {
  args: {
    document: {
      ...baseDocument,
      title: "Climate Change Act <em>2008</em>",
      labels: [
        { type: "category", value: { id: "cat-1", type: "category", value: "Legislation" }, count: null, timestamp: null },
        { type: "label", value: { id: "lbl-1", type: "label", value: "Principal" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-1", type: "country", value: "United Kingdom" }, count: null, timestamp: null },
      ],
      attributes: { published_date: "2008-11-26", deprecated_slug: "climate-change-act-2008" },
    },
  },
};

export const WithGeographies: TStory = {
  args: {
    document: {
      ...baseDocument,
      description: "A multilateral agreement establishing binding emissions targets for signatory nations across multiple continents.",
      labels: [
        { type: "category", value: { id: "cat-1", type: "category", value: "Agreement" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-1", type: "country", value: "France" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-2", type: "country", value: "Germany" }, count: null, timestamp: null },
        { type: "geography", value: { id: "geo-3", type: "country", value: "Japan" }, count: null, timestamp: null },
      ],
      attributes: { published_date: "2015-12-12", deprecated_slug: "paris-agreement" },
    },
  },
};

export const WithAnalytics: TStory = {
  args: {
    document: baseDocument,
    analytics: {
      context: "search-results",
      page: 3,
      positionOffset: 38,
    },
  },
};

export const NoDate: TStory = {
  args: {
    document: {
      ...baseDocument,
      attributes: {},
    },
  },
};
