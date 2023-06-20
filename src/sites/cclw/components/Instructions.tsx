/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { Translation } from "@components/svg/Icons";

const Instructions = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 text-center max-w-screen-lg mx-auto">
      <div className="py-5 lg:py-0 flex flex-col lg:px-4" data-cy="feature-search">
        <div className="mb-6 h-[80px] flex items-center justify-center">
          <img src="/images/earth.png" alt="Phrase highlighting" className="max-h-full" />
        </div>
        <p className="mb-6">Search the full text of over 5000 laws, policies and UNFCCC submissions from every country.</p>
      </div>
      <div className="border-t md:border-t-0 md:border-l border-white py-5 lg:py-0 flex flex-col items-center lg:px-4" data-cy="feature-highlights">
        <div className="mb-6 h-[80px] flex items-center justify-center relative">
          <img src="/images/highlight.png" alt="Phrase highlighting" className="max-h-full" />
        </div>
        <p className="mb-6">See exact matches and related phrases highlighted in the text</p>
      </div>
      <div
        className="hidden border-t lg:border-t-0 lg:border-l border-white py-5 lg:py-0 flex flex-col items-center lg:px-4"
        data-cy="feature-translations"
      >
        <div className="mb-6 h-[80px] flex items-center justify-center">
          <Translation height="60" />
        </div>
        <p className="mb-6">Find English translations of documents published in any language</p>
      </div>
      <div
        className="border-t md:border-t-0 lg:border-t-0 md:border-l border-white py-5 lg:py-0 lg:px-4 flex items-center justify-center flex-wrap"
        data-cy="feature-litigation"
      >
        <p>
          <LinkWithQuery href="/faq" hash="litigation-data" className="font-bold underline">
            Climate litigation
          </LinkWithQuery>{" "}
          is coming soon. Access it now at{" "}
          <ExternalLink url="http://climatecasechart.com/" className="font-bold underline">
            Climate Case Chart
          </ExternalLink>
        </p>
        <p>
          Learn more about{" "}
          <LinkWithQuery href="/faq" className="font-bold underline">
            how to use this site
          </LinkWithQuery>
        </p>
      </div>
    </div>
  );
};
export default Instructions;
