import Image from "next/legacy/image";

import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";
import { Heading } from "@components/typography/Heading";

import { partners } from "@constants/partners";

const Partners = () => {
  return (
    <div className="py-24">
      <SiteWidth>
        <h2 className="text-indigo-500 mb-8 text-center">Our Partners</h2>
        <Heading level={2}>Our partners</Heading>
        <div className="grid grid-cols-1 gap-8 px-4 mb-8 md:flex md:flex-wrap md:gap-[3%] md:justify-center md:mb-0 xl:px-0">
          {partners.map((partner) => (
            <ExternalLink key={partner.link} className="block relative py-12 unset-img md:basis-[30%] md:mb-8" url={partner.link}>
              <Image src={`/images/partners/${partner.logo}`} alt={partner.name} layout="fill" className="custom-img" />
            </ExternalLink>
          ))}
        </div>
      </SiteWidth>
    </div>
  );
};
export default Partners;
