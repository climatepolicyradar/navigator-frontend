import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getButtonClasses } from "@/components/atoms/button/Button";
import { Columns } from "@/components/atoms/columns/Columns";
import { SiteWidth } from "@/components/panels/SiteWidth";

import { Feature } from "./Feature";

export const FeatureDiscover = () => (
  <div className="pt-12 pb-4">
    <SiteWidth>
      <Columns containerClasses="px-0" gridClasses="grid-cols-1 lg:grid-cols-2 gap-8">
        <Feature heading="About us" subheading="Learn about this project" contentSide="left" inline={true}>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The Sabin Center for Climate Change Law's Climate Litigation Database is the most comprehensive resource tracking climate change
            litigation worldwide. It contains more than 3,000 cases that address climate change law, policy, and science.
          </p>
          <LinkWithQuery href="/about" className="text-blue-900 hover:text-blue-800 underline text-lg font-medium">
            Read more →
          </LinkWithQuery>
        </Feature>
        <Feature heading="Get the newsletter" subheading="Stay up to date" contentSide="right" inline={true}>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Subscribe to the Sabin Center Climate Litigation Newsletter for twice-monthly updates. Each issue includes the latest case updates, event
            announcements, and publication highlights.
          </p>
          <ExternalLink
            url="https://mailchi.mp/law/sabin-center-litigation-newsletter"
            className="text-blue-900 hover:text-blue-800 underline text-lg font-medium"
          >
            Subscribe →
          </ExternalLink>
        </Feature>
      </Columns>
    </SiteWidth>
  </div>
);
