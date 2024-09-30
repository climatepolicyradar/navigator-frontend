import React from "react";
import dynamic from "next/dynamic";

import Layout from "@components/layouts/LandingPage";
import { FullWidth } from "@components/panels/FullWidth";
import { SiteWidth } from "@components/panels/SiteWidth";

import Header from "@cclw/components/Header";
import Footer from "@cclw/components/Footer";
import { Hero } from "@cclw/components/Hero";
import { Articles } from "@cclw/components/Articles";
import { Partners } from "@cclw/components/Partners";
import { PoweredBy } from "@cclw/components/PoweredBy";
import { FeatureDiscover } from "@cclw/components/FeatureDiscover";
import { HelpUs } from "@cclw/components/HelpUs";
import { FeatureSearch } from "@cclw/components/FeatureSearch";

import { Heading } from "@components/typography/Heading";

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
        <SiteWidth extraClasses="my-12" data-cy="powered-by">
          <PoweredBy />
        </SiteWidth>
        <FullWidth id="world-map" extraClasses="hidden pt-6 md:block">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-5xl">
            Explore by country
          </Heading>
          <WorldMap />
        </FullWidth>
        <SiteWidth extraClasses="my-12" data-cy="featured-content">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-5xl">
            Featured content
          </Heading>
          <Articles />
        </SiteWidth>
        <div data-cy="homepage-feature-1">
          <FeatureDiscover />
        </div>
        <div data-cy="homepage-feature-2">
          <FeatureSearch />
        </div>
        <div data-cy="homepage-help-us">
          <HelpUs />
        </div>
        <SiteWidth extraClasses="my-12" data-cy="partners">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-5xl">
            Our partners
          </Heading>
          <Partners />
        </SiteWidth>
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
