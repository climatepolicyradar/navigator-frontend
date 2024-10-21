import Image from "next/image";
import React from "react";

import { Heading } from "@components/typography/Heading";
import { ExternalLink } from "@components/ExternalLink";

import { SiteWidth } from "@components/panels/SiteWidth";

const ClimatePolicyRadarBannerHolder = () => {
  return (
    <div className={`bg-cpr-banner py-36 text-white relative`}>
      <SiteWidth>
        <div className="max-w-sm">
          <p className="font-medium tracking-slight text-sm lg:text-md text-[#3399FF] mb-2" data-cy="search-all">
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
      <div className="hidden sm:block sm:absolute sm:right-28 sm:top-10 sm:h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cpr-logo-faded.png" alt="Climate Policy Radar Logo" className="w-[800px] h-[400px]" />
      </div>
    </div>
  );
};

export default ClimatePolicyRadarBannerHolder;
