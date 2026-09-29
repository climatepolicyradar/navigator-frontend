import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";

import { ColourSchemeToggle } from "@/components/atoms/colourSchemeToggle/ColourSchemeToggle";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import MainMenu from "@/components/molecules/mainMenu/MainMenu";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { FeaturesContext } from "@/context/FeaturesContext";
import { MENU_LINKS } from "@/cpr/constants/menuLinks";
import { joinTailwindClasses } from "@/utils/tailwind";

export const CPRLogo = (
  <PageLink href="/" data-cy="cpr-logo">
    <Image
      src="/images/cpr-logo-horizontal-new.svg"
      width={228}
      height={35}
      alt="Climate Policy Radar logo"
      data-cy="cpr-logo"
      loading="eager"
      className="dark:brightness-0 dark:invert"
    />
  </PageLink>
);

export const CPRMenuButton = (
  <div className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-950 font-medium group-data-popup-open:bg-gray-100">
    <LucideMenu size={16} className="text-text-brand" /> Menu
  </div>
);

interface IProps {
  landingPage?: boolean;
}

const OTHER_APPS = [
  {
    url: "https://www.climatecasechart.com/",
    label: "Climate Litigation Database",
  },
  {
    url: "https://www.climate-laws.org/",
    label: "Climate Change Laws of the World",
  },
  {
    url: "https://climateprojectexplorer.org/",
    label: "Climate Project Explorer",
  },
];

const OtherAppsBar = () => (
  <div className="bg-bg-banner hidden md:block">
    <FiveColumns>
      <div className="col-start-1 -col-end-1">
        <ul className="flex items-center justify-end gap-6 py-2 text-sm">
          {OTHER_APPS.map((content) => (
            <li key={content.url}>
              <PageLink external href={content.url} className="text-white hover:underline">
                {content.label}
              </PageLink>
            </li>
          ))}
        </ul>
      </div>
    </FiveColumns>
  </div>
);

const MENU_BUTTONS = [
  { url: "/search", label: "Search", external: false },
  { url: "https://climatepolicyradar.org", label: "About", external: true },
  { url: "/faq", label: "FAQs", external: false },
];

const MenuButtons = () => (
  <div className="flex items-center gap-1">
    {MENU_BUTTONS.map(({ url, label, external }) => (
      <PageLink
        key={label}
        href={url}
        external={external}
        className="px-3 py-2 rounded-md text-sm font-medium text-text-primary bg-bg-primary hover:bg-bg-flat"
      >
        {label}
      </PageLink>
    ))}
  </div>
);

export const Header = ({ landingPage = false }: IProps) => {
  const router = useRouter();
  const features = useContext(FeaturesContext);
  const newSearch = features["new-search"];

  const isHomepage = router.pathname === "/";
  const showSearch = router.pathname !== "/" && !landingPage && router.pathname !== "/_search";

  const navBarClasses = joinTailwindClasses(isHomepage ? "!absolute top-0" : "bg-bg-primary", landingPage && "!static");

  const menuIcon = router.pathname !== "/" ? CPRMenuButton : undefined;

  return (
    <NavBar
      headerClasses={navBarClasses}
      logo={CPRLogo}
      menu={
        <div className="flex items-center gap-1">
          <ColourSchemeToggle />
          <MainMenu icon={menuIcon} links={MENU_LINKS} />
        </div>
      }
      menuButtons={isHomepage ? undefined : newSearch ? undefined : showSearch ? undefined : <MenuButtons />}
      showLogo={!isHomepage}
      showSearch={showSearch && !newSearch}
      topContent={newSearch ? <OtherAppsBar /> : undefined}
    />
  );
};
