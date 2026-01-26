import Image from "next/image";

import { LatestItemsBlock } from "@/components/blocks/latestItemsBlock/LatestItemsBlock";
import { Heading } from "@/components/typography/Heading";
import useGetLatest from "@/hooks/useGetLatest";

import LandingSearchForm from "./LandingSearchForm";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
  exactMatch: boolean;
}

export const Hero = ({ handleSearchInput, searchInput }: IProps) => {
  const latestQuery = useGetLatest(3);

  return (
    <>
      <div className="flex-1 flex flex-col gap-10 md:gap-0 md:justify-between mb-10 md:mb-0">
        <Image src="/images/ccc/sabin-logo-large.png" alt="Sabin Center for Climate Change logo" width={384} height={36} />
        <div className="">
          <Heading level={1} extraClasses="!text-text-primary lg:!text-5xl !font-bold pb-4 max-w-screen-sm">
            The Climate Litigation Database
          </Heading>
          <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
        </div>
      </div>
      <div className="basis-[320px]">
        {latestQuery.isLoading && <p>Loading latest cases...</p>}
        {latestQuery.isFetched && latestQuery.data && <LatestItemsBlock latestItems={latestQuery.data} />}
      </div>
    </>
  );
};
