import Image from "next/image";

import { LatestItemsBlock } from "@/components/blocks/latestItemsBlock/LatestItemsBlock";
import { Heading } from "@/components/typography/Heading";
import { LATEST_ITEMS_STUB } from "@/stubs/latestItemsStub";

import LandingSearchForm from "./LandingSearchForm";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
  exactMatch: boolean;
}

export const Hero = ({ handleSearchInput, searchInput }: IProps) => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-10 md:gap-0 md:justify-between mb-10 md:mb-0">
        <Image src="/images/ccc/sabin-logo-large.png" alt="Sabin Center for Climate Change logo" width={384} height={36} quality={100} />
        <div className="">
          <Heading level={1} extraClasses="!text-text-primary lg:!text-5xl !font-bold pb-4 max-w-screen-sm">
            U.S. and Global Climate Change Litigation Database
          </Heading>
          <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
        </div>
      </div>
      <div className="basis-[320px]">
        <LatestItemsBlock latestItems={LATEST_ITEMS_STUB} />
      </div>
    </>
  );
};
