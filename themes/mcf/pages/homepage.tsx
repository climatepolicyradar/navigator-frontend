import React from "react";

import Layout from "@components/layouts/LandingPage";

import { Header, Footer, Hero, ClimatePolicyRadarBanner, AboutTheFunds, ContextualSearchContent, AboutClimateProjectExplorer } from "@mcf/components";
import { PAGE_DESCRIPTION, APP_NAME } from "@mcf/constants/pageMetadata";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <Layout title="Climate Fund Search" theme={APP_NAME} description={PAGE_DESCRIPTION}>
      <main id="main" className="flex flex-col flex-1">
        <div>
          <Header background={false} showBottomBorder={false} />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <AboutClimateProjectExplorer />
        <ContextualSearchContent />
        <div className={`bg-white border-slate-700 border-solid border-t`}>
          <AboutTheFunds />
        </div>
        <ClimatePolicyRadarBanner />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
