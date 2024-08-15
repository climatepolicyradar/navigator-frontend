import LandingSearchForm from "./LandingSearchForm";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

const Hero = ({ handleSearchInput, searchInput }: TProps) => (
  <div className="pb-6 text-white pt-[28px] sm:pt-[48px] md:pt-[180px] lg:pt-[100px] xl:pt-[140px]">
    <div className="container">
      <div className="mx-auto text-center">
        <p className="font-medium tracking-slight text-lg lg:text-3xl" data-cy="intro-message">
          MCFs: Multilateral Climate Funds
        </p>
      </div>
      <div className="max-w-screen-md mx-auto mt-6">
        <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search full text of any document" input={searchInput} />
      </div>
    </div>
  </div>
);

export default Hero;
