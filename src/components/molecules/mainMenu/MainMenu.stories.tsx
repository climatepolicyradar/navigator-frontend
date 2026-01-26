import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LucideMenu } from "lucide-react";

import { MENU_LINKS as CPR_MENU_LINKS } from "@/cpr/constants/menuLinks";
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

export const CPR: TStory = {
  args: {
    icon: (
      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-950 font-medium group-data-[popup-open]:bg-gray-100">
        <LucideMenu size={16} className="text-brand" /> Menu
      </div>
    ),
    links: CPR_MENU_LINKS,
  },
};

export const MCF: TStory = {
  args: {
    icon: <LucideMenu size={24} className="text-gray-950" />,
    links: MCF_MENU_LINKS,
  },
};
