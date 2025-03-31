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
import { LuArrowRight, LuCornerDownLeft, LuSearch } from "react-icons/lu";
import { NavSearchSuggestion } from "./NavSearchSuggestion";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

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
  const configQuery = useConfig();

  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const pageHasContextualSearch = pagesWithContextualSearch.includes(router.pathname);
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
  if (router.pathname === "/geographies/[id]") contextualSearchName = "This geography";

  // The path to navigate to when submitting the search input
  const searchHref: Url = useMemo(() => {
    const newQuery = CleanRouterQuery({ ...router.query });

    if (searchText) {
      newQuery[QUERY_PARAMS.query_string] = searchText;
    } else {
      delete newQuery[QUERY_PARAMS.query_string];
    }

    let newPathName = "/search";

    if (!searchEverything) {
      switch (router.pathname) {
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

    return { pathname: newPathName, query: newQuery };
  }, [router, searchEverything, searchText]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    router.push(searchHref);
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
              <button type="submit" className="w-4 h-4 ml-0.5 shrink-0">
                <LuSearch height="16" width="16" />
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
        <div className="absolute top-0 left-0 right-0 outline -outline-offset-1 outline-border-lighter rounded-xl bg-surface-light shadow-[0px_4px_48px_0px_rgba(0,0,0,0.08)]">
          {showResults && (
            <div className="flex flex-col gap-3 p-2 pt-[56px]">
              {/* Geographies */}
              {geographyResults.length > 0 && (
                <div>
                  <h3 className="px-2.5 py-1.5 mb-1 text-text-brand text-sm font-medium select-none">Geographies</h3>
                  {geographyResults.map((geography) => (
                    <NavSearchSuggestion
                      key={geography.id}
                      href={`/geographies/${geography.slug}`}
                      Icon={
                        <LuArrowRight height="16" width="16" className="opacity-0 group-hover:opacity-100 text-text-brand transition duration-200" />
                      }
                    >
                      {withBoldMatch(geography.display_value, searchText)}
                    </NavSearchSuggestion>
                  ))}
                </div>
              )}
              {/* Search */}
              <NavSearchSuggestion
                href={searchHref}
                Icon={<LuSearch height="16" width="16" />}
                hint={
                  <div className="text-xs text-text-tertiary font-[440]">
                    Press <LuCornerDownLeft height="12" width="12" className="inline group-hover:text-text-brand transition duration-200" /> ENTER
                  </div>
                }
              >
                All results for <span className="font-bold">&#8216;{searchText}&#8217;</span>
              </NavSearchSuggestion>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
