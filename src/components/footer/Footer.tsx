import { ExternalLink } from "@components/ExternalLink";
import FooterLinks from "./FooterLinks";
import { FullWidth } from "@components/panels/FullWidth";

const Footer = () => {
  return (
    <footer className="py-12 dark-gradient">
      <FullWidth>
        <p className="font-medium text-lg mb-6 text-white md:text-center">
          To report a problem email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359" className="text-white underline hover:text-white">
            Let us know
          </ExternalLink>
        </p>
        <FooterLinks />
      </FullWidth>
    </footer>
  );
};
export default Footer;
