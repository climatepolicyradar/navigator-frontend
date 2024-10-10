import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import SocialMediaContent from "./FooterComponents/SocialMediaContent";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-grey-400">
      <div className="py-12">
        <SiteWidth>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="footer__section w-full md:w-1/2 lg:w-2/3" data-cy="footer-mcf">
              <h2 className="font-greycliff text-2xl font-bold leading-[24px] tracking-[-0.01em] text-left text-headingText text-headingText">
                About
              </h2>
              <p>Climate Project Explorer is a project to reveal all of the data about Multilateral Climate Funds.</p>
              <div className="footer__section">
                <p>
                  The tool is powered by <ExternalLink url="https://www.climatepolicyradar.org">Climate Policy Radar</ExternalLink> who use AI and
                  data science to map the world's climate policies.
                </p>
              </div>
              <SocialMediaContent />
            </div>

            <div className="footer__section">
              <h2 className="font-greycliff text-2xl font-bold leading-[24px] tracking-[-0.01em] text-left text-headingText text-headingText">
                Contact
              </h2>
              <p>
                Get in touch with the Climate Project Explorer team by emailing:{" "}
                <ExternalLink url="mailto:partners@climatepolicyradar.org">partners@climatepolicyradar.org</ExternalLink>
              </p>
              <div className="footer__section">
                <h2 className="font-greycliff text-2xl font-bold leading-[24px] tracking-[-0.01em] text-left text-headingText">Feedback</h2>
                <p>
                  Help us improve this tool. <ExternalLink url="https://www.climatepolicyradar.org">Report missing or inaccurate data</ExternalLink>{" "}
                  or <ExternalLink url="https://www.climatepolicyradar.org">provide feedback </ExternalLink> on your experience.
                </p>
              </div>
            </div>
          </div>
        </SiteWidth>
      </div>
      <div className="footer__base">
        <SiteWidth extraClasses="flex flex-1 items-end h-full pt-[20px] flex-wrap text-sm lg:text-base lg:pt-0 lg:gap-6">
          <p className="lg:mb-6">Copyright © {new Date().getFullYear()} Climate Project Explorer</p>
          <div className="ml-6 flex flex-wrap gap-6 lg:mb-6 lg:ml-0">
            <ExternalLink url="https://www.climatepolicyradar.org/privacy-policy" className="text-textNormal underline">
              Privacy policy
            </ExternalLink>
            <LinkWithQuery href={"/terms-of-use"} className="text-textNormal underline">
              Terms of use
            </LinkWithQuery>
          </div>
        </SiteWidth>
      </div>
    </footer>
  );
};
export default Footer;
