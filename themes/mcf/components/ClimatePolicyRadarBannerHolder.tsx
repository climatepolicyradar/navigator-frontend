import React from "react";
import { Heading } from "@components/typography/Heading";
import { climatePolicyBannerColour } from "@mcf/constants/colors";

const ClimatePolicyRadarBannerHolder = () => {
  return (
    <div className={`bg-[${climatePolicyBannerColour}] py-36  text-center`}>
      <Heading level={1}>Climate Policy Radar Banner Holder</Heading>
    </div>
  );
};

export default ClimatePolicyRadarBannerHolder;
