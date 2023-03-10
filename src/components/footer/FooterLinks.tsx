import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

const FooterLinks = ({ landing = false }) => {
  return (
    <nav>
      <div data-cy="footer-nav" className={`flex flex-col md:flex-row justify-center gap-8 md:gap-16 ${landing ? "text-white" : "text-indigo-500"}`}>
        <ExternalLink url="https://github.com/climatepolicyradar/methodology" className="transtion duration-300 hover:text-blue-500">
          Methodology
        </ExternalLink>
        <LinkWithQuery href="/terms-of-use" className="transtion duration-300 hover:text-blue-500">
          Terms &amp; conditions
        </LinkWithQuery>
        <ExternalLink url="https://climatepolicyradar.org/privacy-policy" className="transtion duration-300 hover:text-blue-500">
          Privacy policy
        </ExternalLink>
      </div>
    </nav>
  );
};
export default FooterLinks;
