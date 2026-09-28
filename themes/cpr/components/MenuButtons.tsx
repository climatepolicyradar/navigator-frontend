import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { joinTailwindClasses } from "@/utils/tailwind";

const MENU_BUTTONS = [
  { url: "/search", label: "Search", external: false },
  { url: "https://climatepolicyradar.org", label: "About", external: true },
  { url: "/faq", label: "FAQs", external: false },
];

type TProps = {
  theme?: "light" | "dark";
};

export const MenuButtons = ({ theme = "light" }: TProps) => {
  const linkClasses = joinTailwindClasses(
    "px-3 py-2 rounded-md text-sm font-medium",
    theme === "dark" ? "text-white bg-transparent hover:bg-white/10" : "text-text-primary bg-white hover:bg-bg-flat"
  );

  return (
    <div className="flex items-center gap-1">
      {MENU_BUTTONS.map(({ url, label, external }) => (
        <PageLink key={label} href={url} external={external} className={linkClasses}>
          {label}
        </PageLink>
      ))}
    </div>
  );
};
