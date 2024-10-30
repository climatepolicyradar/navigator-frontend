import React from "react";

import { SiteWidth } from "@components/panels/SiteWidth";
import { Heading } from "@components/typography/Heading";

type FundDescription = {
  name: string;
  description: string;
};

const fundDescriptions: FundDescription[] = [
  {
    name: "Adaptation Fund",
    description: "(AF) finances projects and programmes that help vulnerable communities in developing countries adapt to climate change.",
  },
  {
    name: "Climate Investment Funds",
    description: "(CIF) is a major multilateral climate fund established in 2008 to finance climate-smart solutions in developing countries.",
  },
  {
    name: "Global Environment Facility",
    description: "(GEF) projects and programmes that help vulnerable communities in developing countries adapt to climate change.",
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
          <a href="/about" className="underline">
            Find out more
          </a>
        </div>
        <div className="hidden xl:block xl:h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mcf/mcf-fund-logos.png" alt="Multilateral Climate Fund Logos" className="h-[34rem]" />
        </div>
      </div>
    </SiteWidth>
  );
};

export default AboutTheFundsContent;
