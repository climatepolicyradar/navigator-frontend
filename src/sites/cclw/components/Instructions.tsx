/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { Translation } from "@components/svg/Icons";

const heroLinkClasses = "text-white font-bold underline hover:text-white";
const heroSectionClasses = "border-t border-white py-5 flex items-center md:px-4 lg:py-0";

const Instructions = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-center max-w-screen-lg mx-auto">
      <div className={`${heroSectionClasses} border-t-0 flex-col`} data-cy="feature-search">
        <div className="mb-6 h-[80px] flex items-center justify-center">
          <img src="/images/earth.png" alt="Phrase highlighting" className="max-h-full" />
        </div>
        <p className="mb-6">Search the full text of over 5000 laws, policies and UNFCCC submissions from every country.</p>
      </div>
      <div className={`${heroSectionClasses} md:border-t-0 md:border-l flex-col`} data-cy="feature-highlights">
        <div className="mb-6 h-[80px] flex items-center justify-center relative">
          <img src="/images/highlight.png" alt="Phrase highlighting" className="max-h-full" />
        </div>
        <p className="mb-6">See exact matches and related phrases highlighted in the text</p>
      </div>
      <div className={`${heroSectionClasses} lg:border-t-0 lg:border-l flex-col`} data-cy="feature-translations">
        <div className="mb-6 h-[80px] flex items-center justify-center">
          <Translation height="60" />
        </div>
        <p className="mb-6">Find documents from all languages translated to English</p>
      </div>
      <div className={`${heroSectionClasses} lg:border-t-0 md:border-l justify-center flex-wrap`} data-cy="feature-litigation">
        <p>
          <LinkWithQuery href="/faq" hash="litigation-data" className={heroLinkClasses}>
            Climate litigation
          </LinkWithQuery>{" "}
          is coming soon. Access it now at{" "}
          <ExternalLink url="http://climatecasechart.com/" className={heroLinkClasses}>
            Climate Case Chart
          </ExternalLink>
        </p>
        <p>
          Learn more about{" "}
          <LinkWithQuery href="/faq" className={heroLinkClasses}>
            how to use this site
          </LinkWithQuery>
        </p>
      </div>
    </div>
  );
};
export default Instructions;
