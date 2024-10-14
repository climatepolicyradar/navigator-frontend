import LandingSearchForm from "./LandingSearchForm";

import { SiteWidth } from "@components/panels/SiteWidth";

const Instructions = () => <p>Loading document stats...</p>;

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const Hero = ({ handleSearchInput, searchInput }: TProps) => (
  <div className="pb-6 text-white pt-[28px] sm:pt-[48px] md:pt-[80px] lg:pt-[100px] xl:pt-[140px]">
    <SiteWidth>
      <div className="mx-auto text-center">
        <p className="font-medium tracking-slight text-lg lg:text-3xl text-blue-500" data-cy="intro-message">
          Multilateral Climate Funds
        </p>
      </div>
      <div className="max-w-screen-md mx-auto mt-6">
        <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search the full text of any document" input={searchInput} />
      </div>
      <div className="mt-6 mt-[48px] sm:mt-[88px] md:mt-[188px] lg:mt-[208px] xl:mt-[248px]">
        <Instructions />
      </div>
    </SiteWidth>
  </div>
);

export default Hero;
