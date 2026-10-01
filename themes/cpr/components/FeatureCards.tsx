import { LucideCode2, LucideGlobe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { SiteWidth } from "@/components/panels/SiteWidth";

type TFeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  linkUrl: string;
  linkLabel: string;
};

const cards: TFeatureCard[] = [
  {
    icon: LucideGlobe,
    title: "Visit our website",
    description: "Find out about our company, people mission, partners and technology. Access climate research news, insights and events.",
    linkUrl: "https://climatepolicyradar.org",
    linkLabel: "Visit website",
  },
  {
    icon: LucideCode2,
    title: "Read our methodology",
    description: "Discover the scope and structure of our database, our data collection methods, terminology, updates and future developments.",
    linkUrl: "https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md",
    linkLabel: "View on Github",
  },
];

const FeatureCards = () => {
  return (
    <div className="py-10 bg-paper">
      <SiteWidth extraClasses="max-w-[924px]! flex flex-col gap-3 md:flex-row">
        {cards.map(({ icon: Icon, title, description, linkUrl, linkLabel }) => (
          <div
            key={title}
            className="flex flex-1 flex-col items-center gap-4 px-4 pt-5 pb-5 text-center bg-white border border-border-light rounded-lg"
          >
            <div className="flex items-center justify-center size-12 bg-inky-blue/5 rounded-full">
              <Icon className="text-text-brand" size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-text-primary">{title}</p>
              <p className="text-base text-text-secondary">{description}</p>
            </div>
            <PageLink
              external
              href={linkUrl}
              className="px-3 py-2 text-[15px] font-medium leading-5 text-white bg-inky-blue rounded-md hocus:bg-inky-navy"
            >
              {linkLabel}
            </PageLink>
          </div>
        ))}
      </SiteWidth>
    </div>
  );
};

export default FeatureCards;
