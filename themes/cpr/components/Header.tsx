import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import { MenuButtons } from "@/cpr/components/MenuButtons";
import { TLandingPageConfig } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

type TTheme = "light" | "dark";

type TThemedProps = {
  theme?: TTheme;
};

const CPR_LOGO: NonNullable<IProps["logo"]> = {
  alt: "Climate Policy Radar logo",
  darkSrc: "/images/cpr-logo-horizontal-new-dark.svg",
  lightSrc: "/images/cpr-logo-horizontal-new.svg",
  width: 228,
  height: 35,
};

export const CPRLogo = ({ theme = "light", logo = CPR_LOGO }: TThemedProps & Pick<IProps, "logo">) => (
  <PageLink href="/" data-cy="cpr-logo">
    <Image
      src={theme === "dark" ? logo.darkSrc : logo.lightSrc}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
      className="w-auto h-[35px]"
      data-cy="cpr-logo"
      loading="eager"
    />
  </PageLink>
);

export const CPRMenuButton = ({ theme = "light" }: TThemedProps) => {
  const darkMenuClasses = "text-white group-hover:text-gray-950 group-data-popup-open:text-gray-950";
  const containerClasses = joinTailwindClasses(
    "flex items-center gap-1 px-2 py-1 rounded-md font-medium group-data-popup-open:bg-gray-100",
    theme === "dark" ? darkMenuClasses : "text-gray-950"
  );
  const iconClasses = theme === "dark" ? darkMenuClasses : "text-text-brand";

  return (
    <div className={containerClasses}>
      <LucideMenu size={16} className={iconClasses} /> Menu
    </div>
  );
};

interface IProps {
  landingPage?: boolean;
  landingPageWithHero?: boolean;
  logo?: TLandingPageConfig["headerLogo"];
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
  <div className="bg-inky-blue hidden md:block">
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

export const Header = ({ landingPage = false, landingPageWithHero = false, logo }: IProps) => {
  const router = useRouter();

  const isHomePage = router.pathname === "/";

  // The homepage and any landing page with a hero run the hero to the top of the
  // page and float the header over it, so the header leaves the flow entirely --
  // its height then costs the hero nothing, and no caller has to offset by it.
  // Everywhere else it stays in flow on a white background.
  const isOverlay = isHomePage || landingPageWithHero;
  const navBarClasses = joinTailwindClasses(isOverlay ? "!absolute top-0" : "bg-white", landingPage && !isOverlay && "!static");

  const theme: TTheme = landingPageWithHero ? "dark" : "light";

  return (
    <NavBar
      headerClasses={navBarClasses}
      logo={<CPRLogo theme={theme} logo={logo} />}
      menu={<MenuButtons theme={theme} />}
      showLogo={!isHomePage}
      topContent={<OtherAppsBar />}
    />
  );
};
