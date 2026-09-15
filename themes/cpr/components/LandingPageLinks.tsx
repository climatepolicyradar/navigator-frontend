import { useContext } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ThemeContext } from "@/context/ThemeContext";
import { SUGGESTED_SEARCHES } from "@/cpr/constants/suggestedSearches";
import { getSuggestionParams } from "@/utils/getSuggestionParams";

const LandingPageLinks = () => {
  const { themeConfig } = useContext(ThemeContext);

  return (
    <section className="mt-18 text-white">
      <div className="font-medium text-2xl">Try these searches</div>
      <ul className="text-lg mt-4">
        {SUGGESTED_SEARCHES.map((suggestion, index) => (
          <li className="my-2" key={index}>
            <PageLink
              href="/search"
              query={getSuggestionParams(suggestion, themeConfig)}
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
