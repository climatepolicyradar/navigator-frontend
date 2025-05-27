import React from "react";
import dynamic from "next/dynamic";

import Layout from "@/components/layouts/LandingPage";
import { FullWidth } from "@/components/panels/FullWidth";
import { SiteWidth } from "@/components/panels/SiteWidth";

import Header from "@/cclw/components/Header";
import Footer from "@/cclw/components/Footer";
import { Hero } from "@/cclw/components/Hero";
import { Articles } from "@/cclw/components/Articles";
import { Partners } from "@/cclw/components/Partners";
import { PoweredBy } from "@/cclw/components/PoweredBy";
import { FeatureDiscover } from "@/cclw/components/FeatureDiscover";
import { HelpUs } from "@/cclw/components/HelpUs";
import { FeatureSearch } from "@/cclw/components/FeatureSearch";
import { PAGE_DESCRIPTION, APP_NAME } from "@/cclw/constants/pageMetadata";
import { Heading } from "@/components/typography/Heading";

// TODO temporarily disabled: https://climate-policy-radar.slack.com/archives/C08Q8GD1CUT/p1745941756888349
// const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
//   loading: () => <p>Loading world map...</p>,
//   ssr: false,
// });

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
}

const LandingPage = ({ handleSearchInput, searchInput }: IProps) => {
  return (
    <Layout title="Law and Policy Search" theme={APP_NAME} description={PAGE_DESCRIPTION}>
      <main id="main" className="flex flex-col flex-1">
        <div className="bg-cclw-dark">
          <Header />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <SiteWidth extraClasses="my-12" data-cy="powered-by">
          <PoweredBy />
        </SiteWidth>
        {/* TODO: reinstate when the world map API is back */}
        {/* <FullWidth id="world-map" extraClasses="hidden pt-6 md:block">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-4xl">
            Explore by country
          </Heading>
          <WorldMap />
        </FullWidth> */}
        <SiteWidth extraClasses="my-12" data-cy="featured-content">
          <Heading level={2} extraClasses="text-center text-3xl xl:text-4xl">
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
          <Heading level={2} extraClasses="text-center text-3xl xl:text-4xl">
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
