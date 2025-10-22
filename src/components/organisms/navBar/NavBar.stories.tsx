import { Meta, StoryObj } from "@storybook/nextjs";

import { Header as CCCHeader } from "@/ccc/components/Header";
import { Header as CCLWHeader } from "@/cclw/components/Header";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { CPRLogo, CPRMenuButton } from "@/cpr/components/Header";
import { MENU_LINKS } from "@/cpr/constants/menuLinks";
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

const CPRArgs = {
  headerClasses: "",
  logo: CPRLogo,
  menu: <MainMenu icon={CPRMenuButton} links={MENU_LINKS} />,
  showLogo: true,
  showSearch: true,
};

export const SearchPage: TStory = {
  args: CPRArgs,
  parameters: {
    nextjs: {
      router: {
        asPath: "/search?q=Adaptation+strategy",
        pathname: "/search",
        query: {
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const GeographyPage: TStory = {
  args: CPRArgs,
  parameters: {
    nextjs: {
      router: {
        asPath: "/geographies/saint-kitts-and-nevis?q=Adaptation+strategy",
        pathname: "/geographies/[id]",
        query: {
          id: "saint-kitts-and-nevis",
          q: "Adaptation strategy",
        },
      },
    },
  },
};

export const FamilyPage: TStory = {
  args: CPRArgs,
  parameters: {
    nextjs: {
      router: {
        asPath: "/document/national-adaptation-strategy-to-climate-change_3bf7?q=Adaptation+strategy",
        pathname: "/document/[id]",
        query: {
          id: "national-adaptation-strategy-to-climate-change_3bf7",
          q: "Adaptation strategy",
        },
      },
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

export const DocumentPage: TStory = {
  args: CPRArgs,
  parameters: documentPageParameters,
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
