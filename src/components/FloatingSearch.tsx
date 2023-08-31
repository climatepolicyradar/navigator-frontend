import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "./svg/Icons";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { QUERY_PARAMS } from "@constants/queryParams";

export const FloatingSearch = () => {
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string] as string;
  const [search, setSearch] = useState("");

  // We specifically do not want to erase any filtering
  const handleSearch = () => {
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj[QUERY_PARAMS.query_string] = search;
    router.push({ pathname: "/search", query: queryObj });
  };

  useEffect(() => {
    setSearch(qQueryString || "");
  }, [qQueryString]);

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <button className="absolute left-0 h-full px-3 text-grey-700" onClick={() => handleSearch()}>
          <span className="block">
            <SearchIcon height="14" width="14" color="gray-500" />
          </span>
        </button>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-[34px] rounded-[40px] text-sm w-full text-gray-500 focus:ring-0"
        />
      </form>
    </div>
  );
};
