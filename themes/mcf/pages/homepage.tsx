import React from "react";
import dynamic from "next/dynamic";

import Layout from "@components/layouts/LandingPage";
import { Heading } from "@components/typography/Heading";

import { Header, Footer, Hero, ClimatePolicyRadarBanner, AboutTheFunds } from "@mcf/components";

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
        <div className={`bg-white border-slate-700 py-60 border-solid  border-2 text-center`}>
          <Heading level={1}>Content Holder</Heading>
        </div>
        <div className={`bg-white border-slate-700 py-36 border-solid  border-2 text-center`}>
          <Heading level={1}>Content Holder</Heading>
        </div>
        <AboutTheFunds />
        <ClimatePolicyRadarBanner />
        <Footer />
      </main>
    </Layout>
  );
};

export default LandingPage;
