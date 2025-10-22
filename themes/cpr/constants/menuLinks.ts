import { TMenuLink } from "@/types";

export const MENU_LINKS: TMenuLink[] = [
  {
    text: "About us",
    href: "https://climatepolicyradar.org",
    external: true,
    cy: "about",
  },
  {
    text: "Methodology",
    href: "https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md",
    external: true,
    cy: "methodology",
  },
  {
    text: "FAQ",
    href: "/faq",
    external: false,
    cy: "faq",
  },
];
