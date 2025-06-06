import React from "react";

import Layout from "@/components/layouts/LandingPage";
import {
  Header,
  Footer,
  Hero,
  ClimatePolicyRadarBanner,
  AboutTheFunds,
  ContextualSearchContent,
  AboutClimateProjectExplorer,
} from "@/mcf/components";
import { PAGE_DESCRIPTION, APP_NAME } from "@/mcf/constants/pageMetadata";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
}

const LandingPage = ({ handleSearchInput, searchInput }: IProps) => {
  return (
    <Layout title="Climate Fund Search" theme={APP_NAME} description={PAGE_DESCRIPTION}>
      <main id="main" className="flex flex-col flex-1">
        <div>
          <Header />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <AboutClimateProjectExplorer />
        <ContextualSearchContent />
        <div className={`bg-white border-solid border-t border-gray-200`}>
          <AboutTheFunds />
        </div>
        <ClimatePolicyRadarBanner />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
