import { Feature } from "./Feature";

import { getButtonClasses } from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { ExternalLink } from "@components/ExternalLink";

export const FeatureDiscover = () => (
  <Feature heading="Central knowledge-base for climate policy data" image="app_search_results.jpg" imageAlt="Screenshot of the search results">
    <p className="text-xl my-4">
      Discover climate laws and policies from over 196 countries, territories, and the European Union. This includes{" "}
      <LinkWithQuery href="/framework-laws" className="underline text-blue-200 hover:text-gray-100">
        climate framework laws
      </LinkWithQuery>{" "}
      and targets for every country.
    </p>
    <div className="flex flex-col gap-4 mt-6 lg:flex-row">
      <LinkWithQuery href="/methodology" className={getButtonClasses()}>
        Learn more about our database
      </LinkWithQuery>
      <ExternalLink
        url="https://form.jotform.com/233131638610347"
        className={getButtonClasses("ghost", false, "!bg-transparent !border-0 !text-blue-300 hover:!text-white hover:!underline")}
      >
        Download our data
      </ExternalLink>
    </div>
  </Feature>
);
