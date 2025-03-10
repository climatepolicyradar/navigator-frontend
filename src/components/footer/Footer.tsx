import { ExternalLink } from "@/components/ExternalLink";
import { SiteWidth } from "@/components/panels/SiteWidth";

import FooterLinks from "./FooterLinks";

const Footer = () => {
  return (
    <footer className="py-12 dark-gradient">
      <SiteWidth>
        <p className="font-medium text-lg mb-5 text-white md:text-center">
          To report a problem, email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359" className="text-white underline hover:text-white">
            Let us know
          </ExternalLink>
        </p>
        <FooterLinks />
      </SiteWidth>
    </footer>
  );
};
export default Footer;
