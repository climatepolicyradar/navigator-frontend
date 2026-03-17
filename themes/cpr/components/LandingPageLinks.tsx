import { useRouter } from "next/router";

import { SUGGESTED_SEARCHES } from "@/cpr/constants/suggestedSearches";

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
    <section className="mt-18 text-white">
      <div className="font-medium text-2xl">Try these searches</div>
      <ul className="text-lg mt-4">
        {SUGGESTED_SEARCHES.map((suggestedSearch, searchIndex) => (
          <li className="my-2" key={searchIndex}>
            <a
              className="text-white hover:text-blue-200 hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleQuickSearch(suggestedSearch.params);
              }}
              data-cy={`quick-search-${searchIndex}`}
            >
              {suggestedSearch.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LandingPageLinks;
