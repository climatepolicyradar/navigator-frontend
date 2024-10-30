import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import SocialMediaContent from "./FooterComponents/SocialMediaContent";
import { Heading } from "@components/typography/Heading";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-grey-400">
      <div className="py-12">
        <SiteWidth>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="footer__section w-full md:w-1/2 lg:w-2/3" data-cy="footer-mcf">
              <Heading level={2} extraClasses="custom-header">
                About
              </Heading>
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
              <Heading level={2} extraClasses="custom-header">
                Contact
              </Heading>
              <p>
                Get in touch with the Climate Project Explorer team by{" "}
                <ExternalLink url="https://form.jotform.com/242955027856365">filling out this form</ExternalLink>.
              </p>
              <div className="footer__section">
                <Heading level={2} extraClasses="custom-header">
                  Feedback
                </Heading>
                <p>
                  Help us improve this tool by <ExternalLink url="https://www.climatepolicyradar.org/">providing feedback</ExternalLink> on your
                  experience.
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
