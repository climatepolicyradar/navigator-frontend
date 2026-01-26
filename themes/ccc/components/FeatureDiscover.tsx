import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";

import { Feature } from "./Feature";

export const FeatureDiscover = () => (
  <div className="w-full pt-12 pb-4 text-text-primary px-2 cols-2:px-4 cols-3:px-6 cols-4:px-8">
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Feature heading="About us" subheading="Learn about this project" image="Homepage-image.png" imageAlt="Climate Case Chart interface">
        <p className="text-lg leading-relaxed mb-6">
          The Sabin Center for Climate Change Law's Climate Litigation Database is the most comprehensive resource tracking climate change litigation
          worldwide. It contains more than 3,000 cases that address climate change law, policy, and science.
        </p>
        <LinkWithQuery href="/about" className="text-text-brand-darker text-lg font-bold">
          Read more →
        </LinkWithQuery>
      </Feature>
      <Feature heading="Get the newsletter" subheading="Stay up to date" image="Newsletter-image.png" imageAlt="Climate Case Chart newsletter">
        <p className="text-lg leading-relaxed mb-6">
          Subscribe to the Sabin Center Climate Litigation Newsletter for twice-monthly updates. Each issue includes the latest case updates, event
          announcements, and publication highlights.
        </p>
        <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter" className="text-text-brand-darker text-lg font-bold">
          Subscribe →
        </ExternalLink>
      </Feature>
    </div>
  </div>
);
