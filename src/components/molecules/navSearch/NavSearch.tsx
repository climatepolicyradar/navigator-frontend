import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { Input } from "@/components/atoms/input/Input";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { Select } from "@base-ui-components/react";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";

/**
 * TODO
 * - Better clear button functionality
 * - Works on search page
 * - Works on family page
 * - Works on document page
 * - Tidy up stories
 */

const searchContextValues = ["Everything", "Document"] as const;
type SearchContext = (typeof searchContextValues)[number];

export const NavSearch = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const queryString = router.query[QUERY_PARAMS.query_string] as string;
  const { pathname } = router;
  const isADocumentPage = pathname.startsWith("/document");
  const showDropdown = isADocumentPage;

  const showResults = isFocused && search;

  const [searchContext, setSearchContext] = useState<SearchContext>(isADocumentPage ? "Document" : "Everything");

  useEffect(() => {
    setSearch(queryString || "");
  }, [queryString]);

  // We specifically do not want to erase any filtering
  const handleSearch = () => {
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj[QUERY_PARAMS.query_string] = search;
    router.push({ pathname: "/search", query: queryObj });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="relative">
      <div className="p-4 relative z-20">
        <form onSubmit={onSubmit} className="flex flex-row">
          {/* Search field */}
          <Input
            containerClasses={`focus-within:!outline-0 ${showDropdown ? "rounded-r-none border-r border-r-border-light" : ""}`}
            icon={
              <button type="submit" className="w-4 h-4 ml-2">
                <Icon name="search" />
              </button>
            }
            iconOnLeft
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search"
            size="large"
            value={search}
            valueSetter={setSearch}
          />

          {/* Dropdown */}
          {showDropdown && (
            <Select.Root defaultValue={searchContext} onValueChange={(value) => setSearchContext(value)}>
              <Select.Trigger className="pl-3 pr-4 flex items-center bg-surface-ui rounded-r-md text-text-secondary text-sm leading-4 font-medium gap-2 cursor-pointer">
                <Select.Value />
                <Select.Icon>
                  <Icon name="downChevron" height="12" width="12" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner side="bottom" align="start">
                  <Select.Popup className="box-border p-0.5 bg-surface-bg rounded-md">
                    {searchContextValues.map((context) => (
                      <Select.Item key={context} value={context} className="pl-3 pr-8 py-0.5 cursor-pointer">
                        <Select.ItemText className="my-2 text-text-secondary text-sm leading-4 font-medium">{context}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          )}
        </form>
      </div>

      {/* Results */}
      {showResults && (
        <div className="absolute top-0 left-0 right-0 border border-border-lighter rounded-xl bg-surface-light shadow-[0px_4px_48px_0px_rgba(0,0,0,0.08)] p-4 pt-19">
          <Button className="inline-block text-base font-normal" color="mono" size="small" rounded variant="ghost" onClick={() => handleSearch()}>
            Search for <span className="font-bold">{search}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
