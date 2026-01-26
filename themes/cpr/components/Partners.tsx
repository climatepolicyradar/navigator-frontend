import Image from "next/legacy/image";

import { ExternalLink } from "@/components/ExternalLink";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { partners } from "@/constants/partners";

const Partners = () => {
  return (
    <div className="py-24">
      <SiteWidth>
        <Heading level={2} extraClasses="text-center">
          Our partners
        </Heading>
        <SingleCol>
          <div className="flex flex-col gap-5 mb-5 md:flex-row md:flex-wrap md:justify-center md:mb-0">
            {partners.map((partner) => (
              <ExternalLink key={partner.link} className="block relative py-12 unset-img md:basis-[30%] md:mb-5" url={partner.link}>
                <Image src={`/images/partners/${partner.logo}`} alt={partner.name} layout="fill" className="custom-img" />
              </ExternalLink>
            ))}
          </div>
        </SingleCol>
      </SiteWidth>
    </div>
  );
};
export default Partners;
