import { Meta, StoryObj } from "@storybook/nextjs";

import { PageLink } from "./PageLink";

const meta = {
  title: "Atoms/PageLink",
  component: PageLink,
  argTypes: {
    children: { control: "text" },
    query: { control: "object" },
  },
  parameters: {
    layout: "centered",
    nextjs: {
      router: {
        asPath: "/search?c=laws&cfn=target",
        pathname: "/search",
        query: {
          c: "laws",
          cfn: "target",
        },
      },
    },
  },
} satisfies Meta<typeof PageLink>;
type TStory = StoryObj<typeof PageLink>;

export default meta;

export const LinkWithoutQuery: TStory = {
  args: {
    children: "Link without query",
    external: false,
    href: "/search",
    keepQuery: false,
    underline: true,
  },
};

export const LinkWithNewQuery: TStory = {
  args: {
    children: "Link with new query",
    external: false,
    keepQuery: false,
    query: { c: "UNFCCC", t: "Nationally Determined Contribution", cfn: "greenhouse gas" },
    underline: true,
  },
};

export const LinkWithOldQuery: TStory = {
  args: {
    children: "Link with old query",
    external: false,
    keepQuery: true,
    underline: true,
  },
};

export const ExternalLink: TStory = {
  args: {
    children: "External link",
    external: true,
    href: "https://www.climatepolicyradar.org",
    keepQuery: false,
    underline: true,
  },
};
