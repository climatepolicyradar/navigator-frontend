import { SiteWidth } from "@/components/panels/SiteWidth";

import { Heading } from "@/components/typography/Heading";
import LandingSearchForm from "./LandingSearchForm";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
}

export const Hero = ({ handleSearchInput, searchInput }: IProps) => {
  return (
    <div className="pb-[33vh] text-white">
      <SiteWidth>
        <div className="flex flex-col items-center justify-center mb-6">
          <Heading level={1} extraClasses="!text-text-light text-5xl font-medium">
            Climate Case Chart
          </Heading>
        </div>
        <div className="max-w-screen-md mx-auto mt-6">
          <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search the full text of any document" input={searchInput} />
        </div>
      </SiteWidth>
    </div>
  );
};
