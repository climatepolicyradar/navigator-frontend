import Image from "next/image";

import { SiteWidth } from "@components/panels/SiteWidth";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

export const Footer = () => {
  return (
    <footer className="py-12 bg-white">
      <SiteWidth>
        <LinkWithQuery href="/">
          <Image src="/images/cpr-logo-horizontal-dark.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
        </LinkWithQuery>
        <p className="font-medium text-lg mb-5 text-textDark md:text-center">
          To report a problem, email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359" className="text-white underline hover:text-white">
            Let us know
          </ExternalLink>
        </p>
        <ul className="flex gap-9">
          <li>
            <ExternalLink url="https://github.com/climatepolicyradar/methodology" className="text-textNormal underline">
              Methodology
            </ExternalLink>
          </li>
          <li>
            <LinkWithQuery href="/terms-of-use" className="text-textNormal underline">
              Terms &amp; conditions
            </LinkWithQuery>
          </li>
          <li>
            <ExternalLink url="https://www.climatepolicyradar.org/privacy-policy" className="text-textNormal underline">
              Privacy policy
            </ExternalLink>
          </li>
        </ul>
      </SiteWidth>
    </footer>
  );
};
