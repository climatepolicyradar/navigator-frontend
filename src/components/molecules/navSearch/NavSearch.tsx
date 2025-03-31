import { Icon } from "@/components/atoms/icon/Icon";
import { Input } from "@/components/atoms/input/Input";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { systemGeoCodes } from "@/constants/systemGeos";
import useConfig from "@/hooks/useConfig";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { sortBy } from "lodash";
import { useRouter } from "next/router";
import { FormEventHandler, MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { NavSearchDropdown } from "./NavSearchDropdown";

const pagesWithContextualSearch: string[] = ["/document/[id]", "/documents/[id]", "/geographies/[id]"];

// Replaces the substring match with bold via JSX.
const withBoldMatch = (text: string, match: string) => {
  if (!text.toLowerCase().includes(match.toLowerCase())) return text;

  const matchIndex = text.toLowerCase().indexOf(match.toLowerCase());
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
  const queryString = [router.query[QUERY_PARAMS.query_string]].flat()[0];
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
          (geography.display_value.toLowerCase().includes(searchText.toLowerCase()) ||
            searchText.toLowerCase().includes(geography.display_value.toLowerCase()))
      ),
      [
        // Prioritises matches where the substring is earlier in the string, then alphabetical
        (geo) => !geo.display_value.toLowerCase().includes(searchText.toLowerCase()),
        (geo) => geo.display_value.toLowerCase().indexOf(searchText.toLowerCase()),
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

  const handleSearchButton: MouseEventHandler<HTMLButtonElement> = (event) => {
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

  return (
    <div className="relative" ref={ref}>
      <div className="p-2 relative z-20">
        <form onSubmit={handleSubmit} className="flex flex-row gap-2">
          {/* Search field */}
          <Input
            autoComplete="off"
            clearable
            containerClasses={`h-[40px] focus-within:!outline-0`}
            icon={
              <button type="submit" className="w-4 h-4 ml-2 shrink-0">
                <Icon name="search" />
              </button>
            }
            iconOnLeft
            inputClasses="text-sm"
            onChange={(event) => setSearchText(event.target.value)}
            onClear={handleClear}
            onFocus={() => setIsFocused(true)}
            placeholder="Search"
            value={searchText}
          />

          {/* Dropdown */}
          {showDropdown && (
            <NavSearchDropdown contextualSearchName={contextualSearchName} isEverything={searchEverything} setIsEverything={setSearchEverything} />
          )}
        </form>
      </div>

      {/* Results */}
      {isFocused && (
        <div className="absolute top-0 left-0 right-0 border border-border-lighter rounded-xl bg-surface-light shadow-[0px_4px_48px_0px_rgba(0,0,0,0.08)] min-h-full">
          {showResults && (
            <div className="p-2 pt-[56px]">
              {/* Geographies */}
              {geographyResults.length > 0 && (
                <div className="my-6 flex flex-col gap-4">
                  <h3 className="text-text-brand text-sm font-medium select-none">Geographies</h3>
                  {geographyResults.map((geography) => (
                    <LinkWithQuery href={`/geographies/${geography.slug}`} key={geography.id} className="text-sm hover:underline">
                      {withBoldMatch(geography.display_value, searchText)}
                    </LinkWithQuery>
                  ))}
                </div>
              )}
              {/* Search */}
              <div className="pt-4 pb-2 not-first:border-t border-border-lighter">
                <button type="button" onClick={handleSearchButton} className="w-full text-sm text-left hover:underline">
                  Search for <span className="font-bold">{searchText}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
