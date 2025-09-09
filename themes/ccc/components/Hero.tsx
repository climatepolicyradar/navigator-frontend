import Image from "next/image";

import { Columns } from "@/components/atoms/columns/Columns";
import { LatestItemsBlock } from "@/components/blocks/latestItemsBlock/LatestItemsBlock";
import { Heading } from "@/components/typography/Heading";
import { LATEST_ITEMS_STUB } from "@/stubs/latestItemsStub";

import LandingSearchForm from "./LandingSearchForm";

interface IProps {
  handleSearchInput: (term: string, filter?: string, filterValue?: string) => void;
  searchInput: string;
  exactMatch: boolean;
  handleSearchChange: (type: string, value: any) => void;
}

export const Hero = ({ handleSearchInput, searchInput, handleSearchChange }: IProps) => {
  return (
    <>
      <div className="flex flex-col justify-between">
        <Image src="/images/ccc/sabin-logo-large.png" alt="Sabin Center for Climate Change logo" width={384} height={36} quality={100} />
        <div className="">
          <Heading level={1} extraClasses="!text-text-primary !text-5xl !font-bold pb-4">
            U.S. and Global Climate Change Litigation Database
          </Heading>
          <LandingSearchForm handleSearchInput={handleSearchInput} input={searchInput} />
        </div>
      </div>
      <div className="">{/* <LatestItemsBlock latestItems={LATEST_ITEMS_STUB} /> */}</div>
    </>
  );
};
