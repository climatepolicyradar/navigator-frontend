import { PageLink } from "@/components/atoms/pageLink/PageLink";

const MENU_BUTTONS = [
  { url: "/search", label: "Search", external: false },
  { url: "https://climatepolicyradar.org", label: "About", external: true },
  { url: "/faq", label: "FAQs", external: false },
];

export const MenuButtons = () => (
  <div className="flex items-center gap-1">
    {MENU_BUTTONS.map(({ url, label, external }) => (
      <PageLink
        key={label}
        href={url}
        external={external}
        className="px-3 py-2 rounded-md text-sm font-medium text-text-primary bg-white hover:bg-bg-flat"
      >
        {label}
      </PageLink>
    ))}
  </div>
);
