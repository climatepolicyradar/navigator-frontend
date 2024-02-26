import { useRouter } from "next/router";
import { ExternalLink } from "@components/ExternalLink";
import FooterLinks from "./FooterLinks";
import { triggerNewSearch } from "@utils/triggerNewSearch";
import { QUERY_PARAMS } from "@constants/queryParams";

const Footer = () => {
  const router = useRouter();
  const handleVespaClick = () => {
    triggerNewSearch(router, "", QUERY_PARAMS.use_vespa, "true");
  };

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
        <span onClick={handleVespaClick} className="cursor-pointer">
          v
        </span>
      </div>
    </footer>
  );
};
export default Footer;
