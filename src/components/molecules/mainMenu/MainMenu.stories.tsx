import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LucideMenu } from "lucide-react";

import { MENU_LINKS as CCC_MENU_LINKS } from "@/ccc/constants/menuLinks";
import { MENU_LINKS as CCLW_MENU_LINKS } from "@/cclw/constants/menuLinks";
import { MENU_LINKS as MCF_MENU_LINKS } from "@/mcf/constants/menuLinks";

import MainMenu from "./MainMenu";

const meta = {
  title: "Molecules/MainMenu",
  component: MainMenu,
  parameters: { layout: "centered" },
  argTypes: {},
} satisfies Meta<typeof MainMenu>;
type TStory = StoryObj<typeof MainMenu>;

export default meta;

export const CCLW: TStory = {
  args: {
    links: CCLW_MENU_LINKS,
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-cclw-dark">
        <Story />
      </div>
    ),
  ],
};

export const MCF: TStory = {
  args: {
    icon: <LucideMenu size={24} className="text-gray-950" />,
    links: MCF_MENU_LINKS,
  },
};

export const CCC: TStory = {
  args: {
    icon: <LucideMenu size={24} className="text-white" />,
    links: CCC_MENU_LINKS,
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-[#677787]">
        <Story />
      </div>
    ),
  ],
};
