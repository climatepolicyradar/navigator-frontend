import { Meta, StoryObj } from "@storybook/nextjs";

import { CCCLogo } from "@/ccc/components/Header";
import { Menu as CCCMenu } from "@/ccc/components/Menu";
import { CCLWLogo } from "@/cclw/components/Header";
import { Menu as CCLWMenu } from "@/cclw/components/Menu";
import MainMenu from "@/components/menus/MainMenu";
import { CPRLogo } from "@/cpr/layouts/main";
import { MCFLogo } from "@/mcf/components/Header";
import { Menu as MCFMenu } from "@/mcf/components/Menu";

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
  headerClasses: "banner",
  logo: CPRLogo,
  menu: <MainMenu />,
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
  args: {
    headerClasses: "bg-cclw-dark",
    logo: CCLWLogo,
    menu: <CCLWMenu />,
    showLogo: true,
    showSearch: true,
  },
  parameters: documentPageParameters,
};

export const MCF: TStory = {
  args: {
    headerClasses: "bg-surface-light min-h-20 border-b border-gray-300 border-solid",
    logo: MCFLogo,
    menu: <MCFMenu />,
    showLogo: true,
    showSearch: true,
  },
  parameters: documentPageParameters,
};

export const CCC: TStory = {
  args: {
    headerClasses: "min-h-12 bg-surface-light !bg-[#677787]",
    logo: CCCLogo,
    menu: <CCCMenu isNotHome={true} />,
    showLogo: true,
    showSearch: true,
  },
  parameters: documentPageParameters,
};
