import React from "react";

import { ExternalLink } from "@components/ExternalLink";

import { AdaptationFundLogo, GlobalEnvironmentFacilityLogo, GreenClimateFundLogo, ClimateInvestmentFundsLogo } from "./logos/logos";

interface FundData {
  name: string;
  url: string;
  imgSrc: string;
  logo: JSX.Element;
}

const fundInformation: FundData[] = [
  {
    name: "Adaptation Fund",
    url: "https://www.adaptation-fund.org/",
    imgSrc: "/images/mcf/AF.png",
    logo: <AdaptationFundLogo />,
  },
  {
    name: "Climate Investment Funds",
    url: "https://www.cif.org/",
    imgSrc: "/images/mcf/CIF.png",
    logo: <ClimateInvestmentFundsLogo />,
  },
  {
    name: "Green Climate Fund",
    url: "https://www.greenclimate.fund/",
    imgSrc: "/images/mcf/GCF.png",
    logo: <GreenClimateFundLogo />,
  },
  {
    name: "Global Environment Facility",
    url: "https://www.thegef.org/",
    imgSrc: "/images/mcf/GEF.png",
    logo: <GlobalEnvironmentFacilityLogo />,
  },
];

export const MultilateralClimateFundLogos = () => {
  return (
    <div className="hidden sm:flex justify-center items-center gap-8 mt-8 mb-4">
      {fundInformation.map((fund, index) => (
        <div key={index} className="w-[120px] h-[60px]">
          <ExternalLink url={fund.url} className="block w-full h-full">
            {fund.logo}
          </ExternalLink>
        </div>
      ))}
    </div>
  );
};
