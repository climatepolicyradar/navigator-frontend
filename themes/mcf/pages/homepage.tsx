import React from "react";
import dynamic from "next/dynamic";

import Layout from "@components/layouts/LandingPage";

import { Hero } from "@mcf/components";

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
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <div id="world-map" className="container hidden pt-6 md:block">
          <h2 className="text-center mb-6">Explore by country</h2>
          <WorldMap />
        </div>
      </main>
    </Layout>
  );
};

export default LandingPage;
