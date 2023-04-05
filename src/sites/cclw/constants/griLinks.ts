type TFooterItem = {
  title: string;
  links: TLinkItem[];
};

export type TLinkItem = {
  text: string;
  href: string;
  external: boolean;
};

const navLinks: TFooterItem = {
  title: "Grantham Research Institute",
  links: [
    {
      text: "Grantham Research Institute",
      href: "https://www.lse.ac.uk/granthaminstitute/",
      external: true,
    },
    {
      text: "Research areas",
      href: "https://www.lse.ac.uk/granthaminstitute/research-areas/",
      external: true,
    },
    {
      text: "Publications",
      href: "https://www.lse.ac.uk/granthaminstitute/publications/",
      external: true,
    },
    {
      text: "Events",
      href: "https://www.lse.ac.uk/granthaminstitute/events/",
      external: true,
    },
    {
      text: "News and commentaries",
      href: "https://www.lse.ac.uk/granthaminstitute/news-and-commentary/",
      external: true,
    },
    {
      text: "Sign up to Grantham Research Institute's newsletter",
      href: "https://www.lse.ac.uk/granthaminstitute/mailing-list/ ",
      external: true,
    },
  ],
};

export default navLinks;
