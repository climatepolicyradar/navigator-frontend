import React from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

type TFundDescription = {
  name: string;
  description: string;
};

const fundDescriptions: TFundDescription[] = [
  {
    name: "Adaptation Fund",
    description: "(AF) finances projects and programmes that help vulnerable communities in developing countries adapt to climate change.",
  },
  {
    name: "Climate Investment Funds",
    description: "(CIF) is a major multilateral climate fund established in 2008 to finance climate-smart solutions in developing countries.",
  },
  {
    name: "The Global Environment Facility",
    description:
      "(GEF) is a multilateral family of funds dedicated to confronting biodiversity loss, climate change, and pollution, and supporting land and ocean health.",
  },
  {
    name: "Green Climate Fund",
    description:
      "(GCF) is the world’s largest dedicated climate fund with a mandate to foster a paradigm shift towards low emission, climate-resilient development pathways in developing countries.",
  },
];

const AboutTheFundsContent = () => {
  return (
    <SiteWidth extraClasses="!max-w-[1024px]">
      <div className="flex justify-between gap-20">
        <div className="content-center xl:max-w-screen-md py-16">
          <Heading level={2} extraClasses="custom-header">
            Funds
          </Heading>
          {fundDescriptions.map((fund) => (
            <p key={fund.name}>
              <strong>{fund.name}</strong> {fund.description}
              <br />
              <br />
            </p>
          ))}
          <LinkWithQuery className="text-blue-600 underline hover:text-blue-800" href="/about">
            Find out more
          </LinkWithQuery>
        </div>
        <div className="hidden xl:flex xl:h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mcf/mcf-fund-logos.png" alt="Multilateral Climate Fund Logos" className="h-auto max-w-[306px]" />
        </div>
      </div>
    </SiteWidth>
  );
};

export default AboutTheFundsContent;
