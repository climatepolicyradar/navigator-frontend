import LandingSearchForm from "./LandingSearchForm";
import Instructions from "./Instructions";
import { LogoLarge } from "./LogoLarge";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

export const Hero = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <div className="md:pt-[140px] pb-6 text-white">
      <div className="container">
        <div className="flex flex-col items-center justify-center mb-6">
          <LogoLarge />
          <h1 className="visually-hidden">Climate Change Laws of the World</h1>
        </div>
        <div className="mx-auto text-center">
          <p className="text-lg lg:text-2xl" data-cy="intro-message">
            Use our database to search climate laws and policies globally
          </p>
        </div>
        <div className="max-w-screen-md mx-auto mt-6">
          <LandingSearchForm
            handleSearchInput={handleSearchInput}
            placeholder="Search the full text of over 5000 laws, policies and UNFCCC submissions"
            input={searchInput}
          />
        </div>
        <div className="mt-6 md:mt-[248px]">
          <Instructions />
        </div>
      </div>
    </div>
  );
};
