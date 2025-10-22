import React from "react";

import Layout from "@/components/layouts/LandingPage";
import AboutClimateProjectExplorer from "@/mcf/components/AboutClimateProjectExplorer";
import AboutTheFunds from "@/mcf/components/AboutTheFunds";
import ClimatePolicyRadarBanner from "@/mcf/components/ClimatePolicyRadarBanner";
import ContextualSearchContent from "@/mcf/components/ContextualSearchContent";
import Footer from "@/mcf/components/Footer";
import { Header } from "@/mcf/components/Header";
import Hero from "@/mcf/components/Hero";
import { TTheme, TThemeConfig } from "@/types";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

const LandingPage = ({ handleSearchInput, searchInput, theme, themeConfig }: IProps) => {
  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="homepage">
      <main id="main" className="flex flex-col flex-1">
        <div>
          <Header />
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
        <AboutClimateProjectExplorer />
        <ContextualSearchContent />
        <div className={`bg-white border-solid border-t border-gray-300`}>
          <AboutTheFunds />
        </div>
        <ClimatePolicyRadarBanner />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
