/* eslint-disable @next/next/no-img-element */
import LandingSearchForm from "@components/forms/LandingSearchForm";
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { Translation } from "@components/svg/Icons";

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
        <div className="mt-6 lg:mt-12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 text-center max-w-screen-lg mx-auto">
          <div className="py-5 lg:py-0 flex flex-col lg:px-4" data-cy="feature-search">
            <div className="mb-2 h-[80px] flex items-center justify-center">
              <img src="/images/earth.png" alt="Phrase highlighting" className="max-h-full" />
            </div>
            <p>Search 3500+ climate law and policy documents from every country</p>
          </div>
          <div
            className="border-t md:border-t-0 md:border-l border-white py-5 lg:py-0 flex flex-col items-center lg:px-4"
            data-cy="feature-highlights"
          >
            <div className="mb-2 h-[80px] flex items-center justify-center relative">
              <img src="/images/highlight.png" alt="Phrase highlighting" className="max-h-full" />
            </div>
            <p>See exact matches and related phrases highlighted in test</p>
          </div>
          {/* <div
            className="border-t lg:border-t-0 lg:border-l border-white py-5 lg:py-0 flex flex-col items-center lg:px-4"
            data-cy="feature-translations"
          >
            <div className="mb-2 h-[80px] flex items-center justify-center">
              <Translation height="60" />
            </div>
            <p>Find English translations of documents published in any language</p>
          </div> */}
          <div className="border-t md:border-t-0 lg:border-t-0 md:border-l border-white py-5 lg:py-0 lg:px-4" data-cy="feature-litigation">
            <div className="mt-6">
              <p>
                <LinkWithQuery href="/faq#litigation" className="font-bold underline">
                  Climate litigation
                </LinkWithQuery>{" "}
                is coming soon. Access it now at{" "}
                <ExternalLink url="http://climatecasechart.com/" className="font-bold underline">
                  Climate Case Chart
                </ExternalLink>
              </p>
            </div>
            <div className="mt-6">
              <p>
                Learn more about{" "}
                <LinkWithQuery href="/faq#litigation" className="font-bold underline">
                  how to use this site
                </LinkWithQuery>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
