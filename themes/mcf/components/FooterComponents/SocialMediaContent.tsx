import React from "react";
import { ExternalLink } from "@components/ExternalLink";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@components/svg/Icons";

const SocialMediaContent = () => {
  const multilateralClimateFundSocialMedia = {
    "Adaptation Fund": [
      { url: "https://twitter.com/adaptationfund", icon: <TwitterIcon /> },
      { url: "https://www.facebook.com/adaptationfund", icon: <FacebookIcon /> },
      {
        icon: <LinkedInIcon />,
        url: "https://www.linkedin.com/company/adaptation-fund",
      },
      {
        url: "https://www.instagram.com/adaptationfund/?hl=en",
        icon: <InstagramIcon />,
      },
    ],
    "Green Climate Fund": [
      { url: "https://twitter.com/theGCF", icon: <TwitterIcon /> },
      { url: "https://facebook.com/GCFOfficial", icon: <FacebookIcon /> },
      {
        url: "https://www.linkedin.com/company/green-climate-fund/",
        icon: <LinkedInIcon />,
      },
    ],
    "Climate Investment Funds": [
      { url: "https://twitter.com/CIF_Action", icon: <TwitterIcon /> },
      { url: "https://www.facebook.com/CIFaction/", icon: <FacebookIcon /> },
      { url: "https://www.linkedin.com/company/cifaction", icon: <LinkedInIcon /> },
    ],
    "Global Environment Facility": [
      { url: "https://twitter.com/theGEF", icon: <TwitterIcon /> },
      { url: "https://www.facebook.com/TheGEF1/", icon: <FacebookIcon /> },
      {
        url: "https://www.linkedin.com/company/global-environment-facility",
        icon: <LinkedInIcon />,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(multilateralClimateFundSocialMedia).map(([fundType, fundSocialMedia]) => (
        <div key={fundType}>
          <h2 className="font-inter-variable text-base font-medium leading-[22.4px] text-left">{fundType}</h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {fundSocialMedia.map((logo, index) => (
              <ExternalLink key={index} url={logo.url}>
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
