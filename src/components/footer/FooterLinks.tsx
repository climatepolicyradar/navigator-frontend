import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";

const FooterLinks = () => {
  return (
    <nav>
      <div data-cy="footer-nav" className="flex flex-col gap-2 md:flex-row justify-center md:gap-8 md:gap-16">
        <ExternalLink url="https://github.com/climatepolicyradar/methodology" className="text-white underline hover:text-blue-500">
          Methodology
        </ExternalLink>
        <LinkWithQuery href="/terms-of-use" className="text-white underline hover:text-blue-500">
          Terms &amp; conditions
        </LinkWithQuery>
        <ExternalLink url="https://climatepolicyradar.org/privacy-policy" className="text-white underline hover:text-blue-500">
          Privacy policy
        </ExternalLink>
      </div>
    </nav>
  );
};
export default FooterLinks;
