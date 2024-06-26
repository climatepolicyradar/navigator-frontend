import { ExternalLink } from "@components/ExternalLink";
import FooterLinks from "./FooterLinks";

const Footer = () => {
  return (
    <footer className="py-12 dark-gradient flex items-center shrink-0">
      <div className="container">
        <p className="font-medium text-lg mb-6 text-white md:text-center">
          To report a problem email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359" className="text-white underline hover:text-white">
            Let us know
          </ExternalLink>
        </p>
        <FooterLinks landing={true} />
      </div>
    </footer>
  );
};
export default Footer;
