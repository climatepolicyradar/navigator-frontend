import { Feature } from "@/cclw/components/Feature";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getButtonClasses } from "@/components/atoms/button/Button";

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
      <LinkWithQuery
        href="/methodology"
        className={getButtonClasses({ color: "brand", rounded: true, className: "!bg-blue-500 hover:!bg-blue-700 !text-lg" })}
      >
        Learn more about our database
      </LinkWithQuery>
      <ExternalLink
        url="https://form.jotform.com/233131638610347"
        className={getButtonClasses({
          variant: "ghost",
          className: "hover:!bg-transparent !text-lg !text-blue-300 hover:!text-white underline",
        })}
      >
        Download our data
      </ExternalLink>
    </div>
  </Feature>
);
