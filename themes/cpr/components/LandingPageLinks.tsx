import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { SUGGESTED_SEARCHES } from "@/cpr/constants/suggestedSearches";

const LandingPageLinks = () => {
  return (
    <section className="mt-18 text-white">
      <div className="font-medium text-2xl">Try these searches</div>
      <ul className="text-lg mt-4">
        {SUGGESTED_SEARCHES.map((suggestion, index) => (
          <li className="my-2" key={index}>
            <PageLink
              href="/search"
              query={suggestion.params}
              className="text-white hover:text-blue-200 hover:underline"
              data-cy={`quick-search-${index}`}
            >
              {suggestion.label}
            </PageLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LandingPageLinks;
