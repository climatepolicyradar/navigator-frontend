import React from "react";
import dynamic from "next/dynamic";

// generic layer component
import Layout from "@components/layouts/LandingPage";
// specific cclw components
import Header from "@cclw/components/Header";
import Footer from "@cclw/components/Footer";
import { Hero } from "@cclw/components/Hero";
import { Articles } from "@cclw/components/Articles";
import { Partners } from "@cclw/components/Partners";
import { PoweredBy } from "@cclw/components/PoweredBy";
import { FeatureDiscover } from "@cclw/components/FeatureDiscover";
import { HelpUs } from "@cclw/components/HelpUs";
import { FeatureSearch } from "@cclw/components/FeatureSearch";

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
        <div className="bg-cclw-dark">
          <Header background={false} />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <div className="container my-12" data-cy="powered-by">
          <PoweredBy />
        </div>
        <div id="world-map" className="container hidden pt-6 md:block">
          <h2 className="text-center mb-6">Explore by country</h2>
          <WorldMap />
        </div>
        <div className="container my-12" data-cy="featured-content">
          <h2 className="text-center mb-6">Featured content</h2>
          <Articles />
        </div>
        <div data-cy="homepage-feature-1">
          <FeatureDiscover />
        </div>
        <div data-cy="homepage-feature-2">
          <FeatureSearch />
        </div>
        <div data-cy="homepage-help-us">
          <HelpUs />
        </div>
        <div className="container my-12" data-cy="partners">
          <h2 className="text-center mb-6">Our partners</h2>
          <Partners />
        </div>
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
