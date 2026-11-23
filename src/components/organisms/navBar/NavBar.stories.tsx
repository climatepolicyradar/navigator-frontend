import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header as CCCHeader } from "@/ccc/components/Header";
import { default as CCLWHeader } from "@/cclw/components/Header";
import { Header as CPRHeader } from "@/cpr/components/Header";
import { Header as MCFHeader } from "@/mcf/components/Header";

import { NavBar } from "./NavBar";

const meta = {
  title: "Organisms/NavBar",
  component: NavBar,
  argTypes: {
    logo: { control: false },
    menu: { control: false },
  },
} satisfies Meta<typeof NavBar>;
type TStory = StoryObj<typeof NavBar>;

export default meta;

const homePageParameters = {
  nextjs: {
    router: {
      asPath: "/",
      pathname: "/",
      query: {},
    },
  },
};

const documentPageParameters = {
  nextjs: {
    router: {
      asPath:
        "/documents/national-strategy-for-adaptation-to-climate-change_f1a4?q=Adaptation+strategy&id=national-adaptation-strategy-to-climate-change_3bf7",
      pathname: "/documents/[id]",
      query: {
        q: "Adaptation strategy",
        id: "national-strategy-for-adaptation-to-climate-change_f1a4",
      },
    },
  },
};

export const CPR: TStory = {
  render: () => <CPRHeader />,
  parameters: documentPageParameters,
};

export const CPRHomepage: TStory = {
  render: () => <CPRHeader />,
  parameters: homePageParameters,
};

export const CPRLandingPageWithHero: TStory = {
  render: () => <CPRHeader landingPageWithHero />,
  parameters: documentPageParameters,
  decorators: [
    (Story) => (
      <div className="relative min-h-[200px] bg-inky-blue">
        <Story />
      </div>
    ),
  ],
};

export const CCLW: TStory = {
  render: () => <CCLWHeader />,
  parameters: documentPageParameters,
};

export const MCF: TStory = {
  render: () => <MCFHeader />,
  parameters: documentPageParameters,
};

export const CCC: TStory = {
  render: () => <CCCHeader />,
  parameters: documentPageParameters,
};
