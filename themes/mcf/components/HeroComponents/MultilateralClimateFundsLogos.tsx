import Image from "next/image";
import React from "react";
import { ExternalLink } from "@components/ExternalLink";

interface FundData {
  name: string;
  url: string;
  imgSrc: string;
}

export const MultilateralClimateFundLogos = () => {
  const fundInformation: FundData[] = [
    {
      name: "Adaptation Fund",
      url: "https://www.adaptation-fund.org/",
      imgSrc: "/images/mcf/AF.png",
    },
    {
      name: "Green Climate Fund",
      url: "https://www.greenclimate.fund/",
      imgSrc: "/images/mcf/GCF.png",
    },
    {
      name: "Climate Investment Funds",
      url: "https://www.cif.org/",
      imgSrc: "/images/mcf/CIF.png",
    },
    {
      name: "Global Environment Facility",
      url: "https://www.thegef.org/",
      imgSrc: "/images/mcf/GEF.png",
    },
  ];

  return (
    <div className="hidden sm:flex justify-center items-center gap-8 mt-8 mb-4">
      {fundInformation.map((fund) => (
        <div key={fund.name} className="w-[100px] h-[42px]">
          <ExternalLink url={fund.url} className="block w-full h-full">
            <Image src={fund.imgSrc} alt={`${fund.name} logo`} width={100} height={42} className="object-contain w-full h-full" />
          </ExternalLink>
        </div>
      ))}
    </div>
  );
};
