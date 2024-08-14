import React from "react";

// generic layer component
import Layout from "@components/layouts/LandingPage";

import { Hero } from "@mcf/components";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <Layout title="MCF">
      <main id="main" className="relative h-full">
        <div className="bg-cclw-dark text-white h-full">
          <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
        </div>
      </main>
    </Layout>
  );
};

export default LandingPage;
