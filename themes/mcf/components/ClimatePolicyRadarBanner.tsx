import React from "react";
import { Heading } from "@components/typography/Heading";
import { ExternalLink } from "@components/ExternalLink";
import ClimatePolicyRadarLogoWhite from "@components/svg/ClimatePolicyRadarLogoWhite";

import { SiteWidth } from "@components/panels/SiteWidth";

const ClimatePolicyRadarBannerHolder = () => {
  return (
    <div className={`bg-cpr-banner py-36 text-white relative`}>
      <SiteWidth>
        <div className="max-w-sm">
          <p className="font-medium tracking-slight text-sm lg:text-md text-white text-opacity-50 mb-2" data-cy="search-all">
            POWERED BY
          </p>
          <Heading level={1} extraClasses="!text-white font-bold text-4xl">
            Climate Policy Radar
          </Heading>
          <br />
          <p>Climate Policy radar uses AI and data science to map the world's climate policies.</p>
          <br />
          <p>
            Visit{" "}
            <ExternalLink className="text-white hover:text-white" url="https://www.climatepolicyradar.org">
              climatepolicyradar.org
            </ExternalLink>
          </p>
        </div>
        <div></div>
      </SiteWidth>
      <div className="hidden sm:block sm:absolute sm:right-0 sm:top-0 sm:h-full">
        <ClimatePolicyRadarLogoWhite />
      </div>
    </div>
  );
};

export default ClimatePolicyRadarBannerHolder;
