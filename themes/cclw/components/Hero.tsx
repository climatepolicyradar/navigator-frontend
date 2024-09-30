import dynamic from "next/dynamic";

import { SiteWidth } from "@components/panels/SiteWidth";

import LandingSearchForm from "./LandingSearchForm";
import { LogoLarge } from "./LogoLarge";
import { Heading } from "@components/typography/Heading";

const Instructions = dynamic(() => import("./Instructions"), {
  loading: () => <p>Loading document stats...</p>,
  ssr: false,
});

type TProps = {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
};

export const Hero = ({ handleSearchInput, searchInput }: TProps) => {
  return (
    <div className="pb-6 text-white pt-[28px] sm:pt-[48px] md:pt-[80px] lg:pt-[100px] xl:pt-[140px]">
      <SiteWidth>
        <div className="flex flex-col items-center justify-center mb-6">
          <LogoLarge />
          <Heading level={1} extraClasses="visually-hidden">
            Climate Change Laws of the World
          </Heading>
        </div>
        <div className="mx-auto text-center">
          <p className="font-medium tracking-slight text-lg lg:text-3xl" data-cy="intro-message">
            Search over 5000 climate laws and policies worldwide
          </p>
        </div>
        <div className="max-w-screen-md mx-auto mt-6">
          <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search full text of any document" input={searchInput} />
        </div>
        <div className="mt-6 mt-[48px] sm:mt-[88px] md:mt-[188px] lg:mt-[208px] xl:mt-[248px]">
          <Instructions />
        </div>
      </SiteWidth>
    </div>
  );
};
