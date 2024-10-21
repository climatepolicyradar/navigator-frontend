import React from "react";
import Image from "next/image";

import { ExternalLink } from "@components/ExternalLink";
import { SiteWidth } from "@components/panels/SiteWidth";
import { Heading } from "@components/typography/Heading";

type FundDescription = {
  name: string;
  description: string;
};

const fundDescriptions: FundDescription[] = [
  {
    name: "Adaptation Fund",
    description: "finances projects and programmes that help vulnerable communities in developing countries adapt to climate change.",
  },
  {
    name: "Climate Investment Funds",
    description: "(CIF) is a major multilateral climate fund established in 2008 to finance climate-smart solutions in developing countries.",
  },
  {
    name: "Global Environment Facility",
    description: "projects and programmes that help vulnerable communities in developing countries adapt to climate change.",
  },
  {
    name: "Green Climate Fund",
    description:
      "(GCF) is the world’s largest dedicated climate fund with a mandate to foster a paradigm shift towards low emission, climate-resilient development pathways in developing countries.",
  },
];

const AboutTheFundsContent = () => {
  return (
    <SiteWidth>
      <div className="flex justify-between">
        <div className="content-center xl:max-w-screen-md py-16">
          <Heading level={2} extraClasses="custom-header">
            The Funds
          </Heading>
          {fundDescriptions.map((fund) => (
            <p key={fund.name}>
              <strong>{fund.name} </strong>
              {fund.description}
              <br />
              <br />
            </p>
          ))}
          <p>
            <ExternalLink className="!underline" url="https://www.climatepolicyradar.org">
              Find out more
            </ExternalLink>
          </p>
        </div>
        <div className="hidden xl:block xl:h-full">
          <Image src="/images/mcf/mcf-fund-logos.png" alt="Multilateral Climate Fund Logos" width={400} height={200} />
        </div>
      </div>
    </SiteWidth>
  );
};

export default AboutTheFundsContent;
