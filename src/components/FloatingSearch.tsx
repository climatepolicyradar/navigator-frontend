import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QUERY_PARAMS } from "@constants/queryParams";
import { SearchIcon } from "./svg/Icons";

export const FloatingSearch = () => {
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string] as string;
  const [search, setSearch] = useState("");

  // We specifically do not want to erase any filtering
  const handleSearch = () => {
    router.query[QUERY_PARAMS.query_string] = search;
    router.push({ pathname: "/search", query: router.query });
  };

  useEffect(() => {
    setSearch(qQueryString || "");
  }, [qQueryString]);

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm w-full text-indigo-400 focus:ring-0 pr-[40px]"
        />
        <button className="absolute right-0 h-full pr-2 text-grey-700" onClick={() => handleSearch()}>
          <span className="border-l border-lineBorder py-1 pl-2 block">
            <SearchIcon height="20" width="20" />
          </span>
        </button>
      </form>
    </div>
  );
};
