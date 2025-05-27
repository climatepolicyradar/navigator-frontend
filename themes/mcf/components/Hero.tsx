import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { VerticalSpacing } from "@/components/utility/VerticalSpacing";

import { MultilateralClimateFundLogos } from "./HeroComponents/MultilateralClimateFundsLogos";
import LandingSearchForm from "./LandingSearchForm";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
}

const Hero = ({ handleSearchInput, searchInput }: IProps) => (
  <div className="pb-6 pt-[28px] sm:pt-[48px] md:pt-[80px] lg:pt-[100px] xl:pt-[140px]">
    <SiteWidth extraClasses="!max-w-[1024px]">
      <div className="mx-auto text-center">
        <p className="font-medium tracking-slight text-lg lg:text-xl text-mcf-blueOpacity64 mb-2 font-greycliff" data-cy="search-all">
          SEARCH ALL
        </p>
        <Heading extraClasses="custom-hero" level={1}>
          Multilateral Climate Funds
        </Heading>
      </div>
      <VerticalSpacing size="lg" />
      <div className="max-w-screen-md mx-auto mt-6">
        <LandingSearchForm handleSearchInput={handleSearchInput} placeholder="Search the full text of any document" input={searchInput} />
      </div>
      <VerticalSpacing size="lg" />
      <MultilateralClimateFundLogos />
      <div className="mt-6 mt-[48px] sm:mt-[88px] md:mt-[188px] lg:mt-[208px] xl:mt-[248px]"></div>
    </SiteWidth>
  </div>
);

export default Hero;
