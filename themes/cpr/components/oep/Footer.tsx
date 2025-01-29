import Image from "next/image";

import { SiteWidth } from "@components/panels/SiteWidth";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

export const Footer = () => {
  return (
    <footer className="py-12 bg-white border-t">
      <SiteWidth>
        <LinkWithQuery href="/">
          <Image src="/images/cpr-logo-horizontal-dark.svg" width={228} height={35} alt="Climate Policy Radar logo" data-cy="cpr-logo" />
        </LinkWithQuery>
        <p className="text-lg my-9 text-textNormal">
          To report a problem, email us at support@climatepolicyradar.org <br /> Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://form.jotform.com/233294135296359" className="text-textDark underline">
            Let us know
          </ExternalLink>
        </p>
        <ul className="md:flex gap-9">
          <li className="mb-4 md:mb-0">
            <ExternalLink url="https://github.com/climatepolicyradar/methodology" className="text-textNormal underline opacity-60 hover:opacity-100">
              Methodology
            </ExternalLink>
          </li>
          <li className="mb-4 md:mb-0">
            <LinkWithQuery href="/terms-of-use" className="text-textNormal underline opacity-60 hover:opacity-100">
              Terms &amp; conditions
            </LinkWithQuery>
          </li>
          <li className="mb-4 md:mb-0">
            <ExternalLink url="https://www.climatepolicyradar.org/privacy-policy" className="text-textNormal underline opacity-60 hover:opacity-100">
              Privacy policy
            </ExternalLink>
          </li>
        </ul>
      </SiteWidth>
    </footer>
  );
};
