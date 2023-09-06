import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LightblubIcon, SearchIcon } from "./svg/Icons";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { QUERY_PARAMS } from "@constants/queryParams";
import { Divider } from "./dividers/Divider";

const FEATURED_SEARCHES = ["Adaptation strategy", "Energy prices", "Flood defense", "Fossil fuels"];
const FEATURED_DOCUMENT_SLUG = "adaptation-strategy-to-climate-change-in-the-czech-republic_3c9c";

export const FloatingSearch = () => {
  const ref = useRef(null);
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string] as string;
  const [search, setSearch] = useState("");
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

  const inputFocusStyles = "rounded-bl-none rounded-br-none";

  // We specifically do not want to erase any filtering
  const handleSearch = (term: string) => {
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj[QUERY_PARAMS.query_string] = term;
    router.push({ pathname: "/search", query: queryObj });
  };

  const handleTryThisClick = (e: any) => {
    e.preventDefault();
    const queryObj = {
      [QUERY_PARAMS.query_string]: "Flood defence",
      [QUERY_PARAMS.country]: "czechia",
    };
    router.push({ pathname: FEATURED_DOCUMENT_SLUG, query: queryObj });
    setShowFloatingSearch(false);
  };

  useEffect(() => {
    setSearch(qQueryString || "");
  }, [qQueryString]);

  // Clicking outside the floating search will close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowFloatingSearch(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <form onSubmit={(e) => e.preventDefault()} className={`${showFloatingSearch ? "w-[425px] lg:w-[625px]" : ""}`}>
        <button className="absolute left-0 h-full px-3 text-grey-700" onClick={() => handleSearch(search)}>
          <span className="block">
            <SearchIcon height="14" width="14" color="gray-500" />
          </span>
        </button>
        <input
          type="search"
          value={search}
          placeholder="Full text of over 5000 climate laws and policies"
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowFloatingSearch(true)}
          className={`pl-[34px] rounded-[20px] text-sm w-full text-gray-800 border-0 focus:ring-0 focus:ring-offset-0 focus:ring-white ${
            showFloatingSearch ? inputFocusStyles : ""
          }`}
        />
      </form>
      {showFloatingSearch && (
        <div className="absolute bg-white px-4 pb-4 left-0 top-[36px] w-[425px] shadow-md rounded-bl-[20px] rounded-br-[20px] lg:w-[625px]">
          <Divider />
          <div className="text-sm mt-4">
            <p className="text-xs text-gray-500 mb-1">Featured searches</p>
            <ul className="flex gap-2 flex-wrap items-center">
              {FEATURED_SEARCHES.map((searchTerm) => (
                <li key={searchTerm}>
                  <button
                    onClick={() => {
                      handleSearch(searchTerm);
                    }}
                    className="text-gray-800 bg-white border border-gray-300 rounded-[40px] py-1 px-2 transition hover:bg-blue-600 hover:text-white"
                  >
                    {searchTerm}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <a
            className="block bg-blue-50 rounded-xl p-2 text-gray-600 mt-4 border border-blue-50 hover:border-blue-600 hover:no-underline"
            onClick={handleTryThisClick}
            href="#"
          >
            <p className="text-xs flex gap-1 items-center">
              <span className="text-blue-300">
                <LightblubIcon />
              </span>{" "}
              Try this out
            </p>
            <p className="text-sm">
              See search results for “<b>Flood defence</b>” highlighted and translated in the document “
              <i>Adaptation strategy to climate change in the Czech Republic</i>”
            </p>
          </a>
        </div>
      )}
    </div>
  );
};
