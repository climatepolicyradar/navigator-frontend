import { useRouter } from "next/router";

import { SUGGESTED_SEARCHES } from "@/ccc/constants/suggestedSearches";
import { ARROW_RIGHT } from "@/constants/chars";

const LandingPageLinks = () => {
  const router = useRouter();

  const handleQuickSearch = (params: Record<string, string>) => {
    // Push directly to search page with all parameters
    router.push({
      pathname: "/search",
      query: {
        ...params,
      },
    });
  };

  return (
    <section className="mt-10 text-textDark">
      <div className="text-textDark font-medium text-2xl mb-5">Try these searches</div>
      <ul className="flex flex-col gap-2">
        {SUGGESTED_SEARCHES.map((suggestedSearch, searchIndex) => (
          <li key={searchIndex}>
            <a
              className="hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleQuickSearch(suggestedSearch.params);
              }}
              data-cy={`quick-search-${searchIndex}`}
            >
              {suggestedSearch.label} {ARROW_RIGHT}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LandingPageLinks;
