import Image from "next/image";

import GRI_LINKS, { TLinkItem } from "@/cclw/constants/griLinks";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { SiteWidth } from "@/components/panels/SiteWidth";

import { Feedback } from "./Feedback";
import MENU_LINKS from "../constants/menuLinks";

const Footer = () => {
  const renderLink = (item: TLinkItem) => {
    if (item.external) {
      return <ExternalLink url={item.href}>{item.text}</ExternalLink>;
    }
    return <LinkWithQuery href={item.href}>{item.text}</LinkWithQuery>;
  };

  return (
    <footer className="flex flex-col">
      <div className="py-12">
        <SiteWidth>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="footer__section" data-cy="footer-cclw">
              <div className="font-medium text-lg">Climate Change Laws of the World</div>
              <ul className="mb-6">
                {MENU_LINKS.map((link) => (
                  <li key={link.href} className="mb-2">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div key={GRI_LINKS.title} className="footer__section" data-cy="footer-gri">
              <div className="font-medium text-lg">{GRI_LINKS.title}</div>
              <ul>
                {GRI_LINKS.links.map((link) => (
                  <li key={link.text} className="mb-2">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
              <div className="footer__section">
                <ul>
                  <li className="mb-2">
                    For media enquiries or queries about research and policy analysis contact{" "}
                    <ExternalLink url="mailto:gri.cgl@lse.ac.uk">gri.cgl@lse.ac.uk</ExternalLink>
                  </li>
                </ul>
              </div>
              <div className="footer__section">
                <div>Follow Grantham Research Institute</div>
                <div className="flex items-start gap-6 footer__social-links">
                  <ExternalLink url="https://twitter.com/GRI_LSE">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/twitter_col.svg" alt="Twitter Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.linkedin.com/company/grantham-research-institute-lse/">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/linkedIn_col.svg" alt="LinkedIn Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.youtube.com/user/GranthamResearch">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/youtube_col.svg" alt="YouTube Logo" />
                  </ExternalLink>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <div className="font-medium text-lg">Climate Policy Radar</div>
              <p>Using AI and data science to map the world's climate documents.</p>
              <ul className="mb-6" data-cy="footer-cpr-links">
                <li className="mb-1">
                  Visit the <ExternalLink url="https://www.climatepolicyradar.org">Climate Policy Radar website</ExternalLink>
                </li>
                <li className="mb-1">
                  <ExternalLink url="https://3566c5a7.sibforms.com/serve/MUIEAPkXK4liqQjleE87527EfcD9gDzY26dQhnJOxNeXZK_TvEAjl_Qu7rrkysJS2ODrj1LioiH24HTGbul2vS1sAxYCPHtu7PgnhZrAE9yCfaFrJ7vzmvBc3u87cs_pkC_99nQ2AqBONHtLwErrV7mcVga2qNlO1xetSeqVVWYsrVPRjg6Rc978eQEMasGQc4PFgIfMFza8TJEv">
                    Newsletter
                  </ExternalLink>
                </li>
                <li className="mb-1">
                  <ExternalLink url="https://www.climatepolicyradar.org/contact">Contact</ExternalLink>
                </li>
              </ul>
              <div className="footer__section">
                <div>Follow Climate Policy Radar</div>
                <div className="flex items-start gap-6 footer__social-links">
                  <ExternalLink url="https://twitter.com/climatepolradar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/twitter_col.svg" alt="Twitter Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.linkedin.com/company/climate-policy-radar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/linkedIn_col.svg" alt="LinkedIn Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.youtube.com/channel/UCjcQnXKzZmo7r9t-RnHjbnA">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/youtube_col.svg" alt="YouTube Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://github.com/climatepolicyradar/">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/social/github-white.svg" alt="GitHub Logo" />
                  </ExternalLink>
                </div>
              </div>
              <div className="footer__section mt-4">
                <Feedback />
              </div>
            </div>
          </div>
        </SiteWidth>
      </div>
      <div className="footer__base">
        <SiteWidth extraClasses="flex flex-1 items-end h-full pt-[114px] flex-wrap text-sm lg:text-lg lg:pt-0 lg:gap-6">
          <p className="lg:mb-6">Copyright © LSE {new Date().getFullYear()}</p>
          <div className="ml-6 flex flex-wrap gap-6 lg:mb-6 lg:ml-0">
            <ExternalLink url="https://www.climatepolicyradar.org/privacy-policy" className="text-secondary-700 underline">
              Privacy policy
            </ExternalLink>
            <LinkWithQuery href={"/terms-of-use"} className="text-secondary-700 underline">
              Terms of use
            </LinkWithQuery>
          </div>
          <div className="mb-6 items-center flex flex-nowrap flex-1 gap-6 basis-full lg:basis-auto lg:justify-end" data-cy="footer-partners">
            <ExternalLink className="flex" url="https://www.lse.ac.uk/">
              <span className="flex" data-cy="lse-logo">
                <Image src="/images/partners/lse-logo.png" alt="London School of Economics logo" width={31} height={32} />
              </span>
            </ExternalLink>
            <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
              <span className="flex" data-cy="gri-logo">
                <Image src="/images/cclw/partners/gri-logo.png" alt="Grantham Research Institute logo" width={169} height={32} />
              </span>
            </ExternalLink>
            <ExternalLink className="flex" url="https://www.climatepolicyradar.org">
              <span className="flex" data-cy="cpr-logo">
                <Image src="/images/cclw/partners/cpr-logo.png" alt="Climate Policy Radar logo" width={232} height={42} />
              </span>
            </ExternalLink>
          </div>
        </SiteWidth>
      </div>
    </footer>
  );
};
export default Footer;
