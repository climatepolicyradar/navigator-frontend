import React from "react";

import { ExternalLink } from "@components/ExternalLink";

import { AdaptationFundLogo, GlobalEnvironmentFacilityLogo, GreenClimateFundLogo, ClimateInvestmentFundsLogo } from "./logos/logos";

interface FundData {
  logo: JSX.Element;
  name: string;
  url: string;
}

const fundInformation: FundData[] = [
  {
    logo: <AdaptationFundLogo />,
    name: "Adaptation Fund",
    url: "https://www.adaptation-fund.org/",
  },
  {
    logo: <ClimateInvestmentFundsLogo />,
    name: "Climate Investment Funds",
    url: "https://www.cif.org/",
  },
  {
    logo: <GreenClimateFundLogo />,
    name: "Green Climate Fund",
    url: "https://www.greenclimate.fund/",
  },
  {
    logo: <GlobalEnvironmentFacilityLogo />,
    name: "Global Environment Facility",
    url: "https://www.thegef.org/",
  },
];

export const MultilateralClimateFundLogos = () => {
  return (
    <div className="hidden sm:flex justify-center items-center gap-8 mt-8 mb-4">
      {fundInformation.map((fund) => (
        <div key={fund.name} className="w-[120px] h-[60px]">
          <ExternalLink url={fund.url} className="block w-full h-full">
            {fund.logo}
          </ExternalLink>
        </div>
      ))}
    </div>
  );
};
