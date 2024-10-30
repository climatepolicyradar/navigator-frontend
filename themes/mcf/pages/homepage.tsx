import React from "react";

import Layout from "@components/layouts/LandingPage";

import { Header, Footer, Hero, ClimatePolicyRadarBanner, AboutTheFunds, ContextualSearchContent, AboutClimateProjectExplorer } from "@mcf/components";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <Layout title="Multilateral climate fund search">
      <main id="main" className="flex flex-col flex-1">
        <div>
          <Header background={false} showBottomBorder={false} />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <AboutClimateProjectExplorer />
        <ContextualSearchContent />
        <div className={`bg-white border-slate-700 border-solid border-2`}>
          <AboutTheFunds />
        </div>
        <ClimatePolicyRadarBanner />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
