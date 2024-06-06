import Image from "next/image";

import { ExternalLink } from "@components/ExternalLink";

export const PoweredBy = () => (
  <div className="md:flex justify-center gap-12 text-center">
    <div className="mb-12 md:mb-0">
      <p className="font-base mb-2">Hosted by</p>
      <div className="flex items-center justify-center gap-6">
        <ExternalLink className="flex" url="https://www.lse.ac.uk/">
          <span className="flex" data-cy="lse-logo">
            <Image src="/images/partners/lse-logo.png" alt="London School of Economics logo" width={51} height={52} />
          </span>
        </ExternalLink>
        <ExternalLink className="flex" url="https://www.lse.ac.uk/granthaminstitute/">
          <span className="flex" data-cy="gri-logo">
            <Image src="/images/cclw/partners/gri-logo.png" alt="Grantham Research Institute logo" width={275} height={52} />
          </span>
        </ExternalLink>
      </div>
    </div>
    <div>
      <p className="font-base mb-2">Powered by</p>
      <ExternalLink className="flex justify-center" url="https://www.climatepolicyradar.org">
        <span className="flex" data-cy="cpr-logo">
          <Image src="/images/cclw/partners/cpr-logo.png" alt="Climate Policy Radar logo" width={287} height={52} />
        </span>
      </ExternalLink>
    </div>
  </div>
);
