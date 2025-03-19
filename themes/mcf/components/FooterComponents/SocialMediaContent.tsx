import React from "react";

import { ExternalLink } from "@/components/ExternalLink";

import { multilateralClimateFundSocialMedia } from "./socialMediaData";

const SocialMediaContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(multilateralClimateFundSocialMedia).map(([fundType, fundSocialMedia]) => (
        <div key={fundType}>
          <h2 className="font-inter-variable text-base font-medium leading-[22.4px] text-left">{fundType}</h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {fundSocialMedia.map((logo, index) => (
              <ExternalLink key={index} url={logo.url} className="text-mcf-iconGrey">
                {logo.icon}
              </ExternalLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaContent;
