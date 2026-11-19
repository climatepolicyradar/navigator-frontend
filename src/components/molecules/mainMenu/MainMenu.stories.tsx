import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LucideMenu } from "lucide-react";

import { MENU_LINKS as MCF_MENU_LINKS } from "@/mcf/constants/menuLinks";
import { TMenuLink } from "@/types";

import MainMenu from "./MainMenu";

const meta = {
  title: "Molecules/MainMenu",
  component: MainMenu,
  parameters: { layout: "centered" },
  argTypes: {},
} satisfies Meta<typeof MainMenu>;
type TStory = StoryObj<typeof MainMenu>;

export default meta;

const CPR_MENU_LINKS: TMenuLink[] = [
  { text: "About us", href: "https://climatepolicyradar.org", external: true, cy: "about" },
  { text: "Methodology", href: "https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md", external: true, cy: "methodology" },
  { text: "FAQ", href: "/faq", external: false, cy: "faq" },
];

export const CPR: TStory = {
  args: {
    icon: (
      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[#030712] font-medium group-data-[popup-open]:bg-[#f3f4f6]">
        <LucideMenu size={16} className="text-[#0038a9]" /> Menu
      </div>
    ),
    links: CPR_MENU_LINKS,
  },
};

export const MCF: TStory = {
  args: {
    icon: <LucideMenu size={24} className="text-[#030712]" />,
    links: MCF_MENU_LINKS,
  },
};
