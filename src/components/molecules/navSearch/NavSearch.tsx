import { Icon } from "@/components/atoms/icon/Icon";
import { Input } from "@/components/atoms/input/Input";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { systemGeoCodes } from "@/constants/systemGeos";
import useConfig from "@/hooks/useConfig";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { sortBy } from "lodash";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { NavSearchDropdown } from "./NavSearchDropdown";

const pagesWithContextualSearch: string[] = ["/document/[id]", "/documents/[id]", "/geographies/[id]"];

const withBoldMatch = (text: string, match: string) => {
  if (!text.toLocaleLowerCase().includes(match.toLocaleLowerCase())) return text;

  const matchIndex = text.toLocaleLowerCase().indexOf(match.toLocaleLowerCase());
  const beforeMatch = text.slice(0, matchIndex);
  const matchText = text.slice(matchIndex, matchIndex + match.length);
  const afterMatch = text.slice(matchIndex + match.length);

  return (
    <>
      {beforeMatch.length > 0 && beforeMatch}
      <span className="font-semibold">{matchText}</span>
      {afterMatch.length > 0 && afterMatch}
    </>
  );
};

export const NavSearch = () => {
  const ref = useRef(null);
  const router = useRouter();
  const queryString = router.query[QUERY_PARAMS.query_string] as string;
  const { pathname } = router;
  const configQuery = useConfig();

  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const pageHasContextualSearch = pagesWithContextualSearch.includes(pathname);
  const [searchEverything, setSearchEverything] = useState<boolean>(!pageHasContextualSearch);
  const showDropdown = pageHasContextualSearch;
  const showResults = isFocused && searchText;

  useEffect(() => {
    setSearchText(queryString || "");
  }, [queryString]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  const geographyResults = useMemo(() => {
    if (searchText.length < 2) return [];

    const geographies = configQuery.data?.countries || [];

    return sortBy(
      geographies.filter(
        (geography) =>
          !systemGeoCodes.includes(geography.slug) &&
          (geography.display_value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
            searchText.toLocaleLowerCase().includes(geography.display_value.toLowerCase()))
      ),
      [
        (geo) => !geo.display_value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
        (geo) => geo.display_value.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()),
        "display_value",
      ]
    );
  }, [searchText, configQuery]);

  let contextualSearchName = "This document";
  if (pathname === "/geographies/[id]") contextualSearchName = "This geography";

  const handleSearch = (searchQuery: string) => {
    const newQuery = CleanRouterQuery({ ...router.query });

    if (searchQuery) {
      newQuery[QUERY_PARAMS.query_string] = searchQuery;
    } else {
      delete newQuery[QUERY_PARAMS.query_string];
    }

    let newPathName = "/search";

    if (!searchEverything) {
      switch (pathname) {
        case "/document/[id]":
          newPathName = `/document/${router.query.id}`;
          break;
        case "/documents/[id]":
          newPathName = `/documents/${router.query.id}`;
          break;
        case "/geographies/[id]":
          newQuery[QUERY_PARAMS.country] = router.query.id;
      }
    }

    router.push({ pathname: newPathName, query: newQuery });
    setIsFocused(false);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleSearch(searchText);
  };

  const handleSearchLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    handleSearch(searchText);
  };

  const handleClear = () => {
    setSearchText("");
    const newQuery = { ...router.query };
    delete newQuery[QUERY_PARAMS.query_string];
    router.push({ query: newQuery });
    setIsFocused(false);
  };

  const handleGeography = (geoSlug: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push({ pathname: `/geographies/${geoSlug}` });
    setSearchText("");
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="p-4 relative z-20">
        <form onSubmit={handleSubmit} className="flex flex-row">
          {/* Search field */}
          <Input
            autoComplete="off"
            clearable
            containerClasses={`focus-within:!outline-0 ${showDropdown ? "rounded-r-none" : ""}`}
            icon={
              <button type="submit" className="w-4 h-4 ml-2">
                <Icon name="search" />
              </button>
            }
            iconOnLeft
            onChange={(event) => setSearchText(event.target.value)}
            onClear={handleClear}
            onFocus={() => setIsFocused(true)}
            placeholder="Search"
            size="large"
            value={searchText}
          />

          {/* Dropdown */}
          {showDropdown && (
            <NavSearchDropdown contextualSearchName={contextualSearchName} isEverything={searchEverything} setIsEverything={setSearchEverything} />
          )}
        </form>
      </div>

      {/* Results */}
      {showResults && (
        <div className="absolute top-0 left-0 right-0 border border-border-lighter rounded-xl bg-surface-light shadow-[0px_4px_48px_0px_rgba(0,0,0,0.08)] p-4 pt-16">
          {/* Geographies */}
          {geographyResults.length > 0 && (
            <div className="my-6 flex flex-col gap-4">
              <h3 className="text-text-brand text-sm font-medium select-none">Geographies</h3>
              {geographyResults.map((geography) => (
                <a href="#" onClick={handleGeography(geography.slug)} key={geography.id} className="text-sm hover:underline">
                  {withBoldMatch(geography.display_value, searchText)}
                </a>
              ))}
            </div>
          )}
          {/* Search */}
          <div className="pt-4 pb-2 not-first:border-t border-border-lighter">
            <a href="#" onClick={handleSearchLink} className="block text-sm hover:underline">
              Search for <span className="font-bold">{searchText}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
