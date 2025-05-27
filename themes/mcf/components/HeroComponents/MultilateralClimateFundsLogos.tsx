import { ExternalLink } from "@/components/ExternalLink";

interface IFundData {
  imgSrc: string;
  name: string;
  url: string;
}

const fundInformation: IFundData[] = [
  {
    imgSrc: "/images/mcf/AF.png",
    name: "Adaptation Fund",
    url: "https://www.adaptation-fund.org/",
  },
  {
    imgSrc: "/images/mcf/CIF.png",
    name: "Climate Investment Funds",
    url: "https://www.cif.org/",
  },
  {
    imgSrc: "/images/mcf/GCF.png",
    name: "Green Climate Fund",
    url: "https://www.greenclimate.fund/",
  },
  {
    imgSrc: "/images/mcf/GEF.png",
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fund.imgSrc} alt={`${fund.name} logo`} className="object-contain w-full h-full" />
          </ExternalLink>
        </div>
      ))}
    </div>
  );
};
