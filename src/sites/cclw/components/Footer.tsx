/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import MENU_LINKS from "../constants/menuLinks";
import GRI_LINKS, { TLinkItem } from "../constants/griLinks";

const Footer = () => {
  const renderLink = (item: TLinkItem) => {
    if (item.external) {
      return <ExternalLink url={item.href}>{item.text}</ExternalLink>;
    }
    return <LinkWithQuery href={item.href}>{item.text}</LinkWithQuery>;
  };

  return (
    <footer className="flex flex-col bg-grey-400">
      <div className="py-12">
        <div className="container">
          <p className="text-lg mb-6 md:text-center" data-cy="report-problem">
            To report a problem email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
            <ExternalLink
              url="https://docs.google.com/forms/d/e/1FAIpQLScNy6pZTInQKdxNDaZPKyPGgbfRktstzgVDjGBCeTnLVzl3Pg/viewform"
              className="underline"
            >
              Let us know
            </ExternalLink>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="footer__section" data-cy="footer-cclw">
              <h5>Climate Change Laws of the World</h5>
              <ul className="mb-6">
                {MENU_LINKS.map((link) => (
                  <li key={link.href} className="mb-1">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>

            <div key={GRI_LINKS.title} className="footer__section" data-cy="footer-gri">
              <h5>{GRI_LINKS.title}</h5>
              <ul>
                {GRI_LINKS.links.map((link) => (
                  <li key={link.text} className="mb-1">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
              <div className="footer__section">
                <ul>
                  <li className="mb-1">
                    For media enquiries contact{" "}
                    <ExternalLink url="mailto:gri.cgl@lse.co.uk" className="block">
                      gri.cgl@lse.co.uk
                    </ExternalLink>
                  </li>
                  <li className="mb-1">
                    <LinkWithQuery href="/contact">Full contact details</LinkWithQuery>
                  </li>
                </ul>
              </div>
              <div className="footer__section">
                <div>Follow Grantham Research Institute</div>
                <div className="flex items-start gap-6 footer__social-links">
                  <ExternalLink url="https://twitter.com/GRI_LSE">
                    <img src="/images/social/twitter.svg" alt="Twitter Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.youtube.com/user/GranthamResearch">
                    <img src="/images/social/youtube.svg" alt="YouTube Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.linkedin.com/company/grantham-research-institute-lse/">
                    <img src="/images/social/linkedIn.svg" alt="LinkedIn Logo" />
                  </ExternalLink>
                </div>
              </div>
            </div>

            <div className="footer__section" data-cy="footer-cpr">
              <h5>Climate Policy Radar</h5>
              <p>Using AI and data science to map the world's climate policies</p>
              <ul className="mb-6">
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
                    <img src="/images/social/twitter.svg" alt="Twitter Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.youtube.com/channel/UCjcQnXKzZmo7r9t-RnHjbnA">
                    <img src="/images/social/youtube.svg" alt="YouTube Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://www.linkedin.com/company/climate-policy-radar">
                    <img src="/images/social/linkedIn.svg" alt="LinkedIn Logo" />
                  </ExternalLink>
                  <ExternalLink url="https://github.com/climatepolicyradar/">
                    <img src="/images/social/github.svg" alt="GitHub Logo" />
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__base">
        <div className="container flex flex-1 items-end md:gap-10 h-full">
          <p className="mb-6">Copyright © LSE {new Date().getFullYear()}</p>
          <div className="mb-6 flex flex-wrap md:gap-10 order">
            <ExternalLink url="https://www.climatepolicyradar.org/privacy-policy" className="text-secondary-700 underline">
              Privacy policy
            </ExternalLink>
            <LinkWithQuery href={"/terms-of-use"} className="text-secondary-700 underline">
              Terms of use
            </LinkWithQuery>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
