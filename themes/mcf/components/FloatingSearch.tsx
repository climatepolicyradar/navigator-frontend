import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "@components/svg/Icons";
import { Divider } from "@components/dividers/Divider";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { QUERY_PARAMS } from "@constants/queryParams";

const FEATURED_SEARCHES = ["Adaptation strategy", "Energy prices", "Flood defence", "Fossil fuels"];

const FloatingSearch = () => {
  const ref = useRef(null);
  const router = useRouter();

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
        <button className="absolute left-0 h-full px-3 text-grey-500" onClick={() => handleSearch(search)} aria-label="Search">
          <span className="block">
            <SearchIcon height="12" width="12" color="gray-500" />
          </span>
        </button>
        <input
          type="search"
          value={search}
          placeholder="Full text of over 5,000 multilateral climate fund projects"
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => handleInputFocus()}
          className={`pl-[34px] rounded-[20px] text-sm w-full bg-white text-gray-800 border-1 focus:ring-0 focus:ring-offset-0 focus:ring-white ${
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
                    className="text-gray-800 bg-white border border-gray-300 rounded-[40px] py-1 px-2 transition hover:bg-mcf-blue hover:text-white"
                  >
                    {searchTerm}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingSearch;
