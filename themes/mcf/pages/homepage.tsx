import React from "react";

import { Hero } from "@mcf/components";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const LandingPage = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <main id="main" className="relative h-full">
      <div className="bg-cclw-dark text-white h-full">
        <Hero handleSearchInput={handleSearchInput} searchInput={searchInput} />
      </div>
    </main>
  );
};

export default LandingPage;
