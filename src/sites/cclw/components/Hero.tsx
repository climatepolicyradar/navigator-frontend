import LandingSearchForm from "@components/forms/LandingSearchForm";
import Instructions from "./Instructions";

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

export const Hero = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <div className="pt-12 pb-6 text-white">
      <div className="container">
        <div className="mx-auto text-center">
          <p className="text-lg lg:text-2xl" data-cy="intro-message">
            Use our database to search climate laws and policies globally
          </p>
        </div>
        <div className="max-w-screen-lg mx-auto mt-6">
          <LandingSearchForm
            handleSearchInput={handleSearchInput}
            placeholder="Search full text of 3,500+ climate laws and policies"
            input={searchInput}
          />
        </div>
        <div className="mt-6 lg:mt-12">
          <Instructions />
        </div>
      </div>
    </div>
  );
};
