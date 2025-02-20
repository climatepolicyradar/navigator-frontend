import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LightblubIcon, SearchIcon } from "./svg/Icons";
import { Divider } from "./dividers/Divider";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { QUERY_PARAMS } from "@constants/queryParams";

const FEATURED_SEARCHES = ["Adaptation strategy", "Energy prices", "Flood defence", "Fossil fuels"];
const FEATURED_DOCUMENT_SLUG = "/documents/adaptation-strategy-to-climate-change-in-the-czech-republic_213b";

type TProps = {
  extended?: boolean;
  placeholder?: string;
  extraButtonClasses?: string;
};

export const FloatingSearch = ({ extended = true, placeholder, extraButtonClasses }: TProps) => {
  const ref = useRef(null);
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string] as string;
  const [search, setSearch] = useState("");
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

  const inputFocusStyles = "rounded-bl-none rounded-br-none";

  const handleInputFocus = () => {
    setShowFloatingSearch(true);
  };

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
      <form onSubmit={(e) => e.preventDefault()} className={`${showFloatingSearch || !extended ? "w-[425px] lg:w-[625px]" : ""}`}>
        <button className="absolute left-0 h-full px-3 text-grey-500" onClick={() => handleSearch(search)} aria-label="Search">
          <span className="block">
            <SearchIcon height="12" width="12" color="gray-500" />
          </span>
        </button>
        <input
          type="search"
          value={search}
          placeholder={`${placeholder ? placeholder : "Full text of over 5,000 climate laws and policies"}`}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => handleInputFocus()}
          className={`pl-[34px] rounded-[20px] text-sm w-full bg-white text-gray-800 border-1 border-borderNormal focus:ring-0 focus:ring-offset-0 focus:ring-white focus:outline-none focus:border-borderNormal ${
            showFloatingSearch ? inputFocusStyles : ""
          }`}
          name="new-search"
        />
      </form>
      {showFloatingSearch && (
        <div className="absolute bg-white border-borderNormal border border-t-0 px-4 pb-4 left-0 top-[36px] w-[425px] shadow-md rounded-bl-[20px] rounded-br-[20px] lg:w-[625px]">
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
                    className={`bg-white border border-gray-200 rounded-[40px] py-1 px-2 transition hover:border-blue-600 hover:text-textDark ${extraButtonClasses}`}
                  >
                    {searchTerm}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {extended && (
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
                See search results for “<b>Flood defence</b>” highlighted and translated in the document “<i>Adaptation strategy to climate change</i>
                ” in Czechia
              </p>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
