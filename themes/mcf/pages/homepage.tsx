import React from "react";
import dynamic from "next/dynamic";

import Layout from "@components/layouts/LandingPage";
import { FullWidth } from "@components/panels/FullWidth";
import { Heading } from "@components/typography/Heading";

import { Header, Footer, Hero, ClimatePolicyRadarBannerHolder } from "@mcf/components";

const WorldMap = dynamic(() => import("@components/map/WorldMap"), {
  loading: () => <p>Loading world map...</p>,
  ssr: false,
});

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <Layout title="Law and Policy Search">
      <main id="main" className="flex flex-col flex-1">
        <div>
          <Header background={false} />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <FullWidth id="world-map" extraClasses="hidden pt-6 md:block">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-4xl">
            Explore by country
          </Heading>
          <WorldMap />
        </FullWidth>

        <ClimatePolicyRadarBannerHolder />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
