import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { Input } from "@/components/atoms/input/Input";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { Select } from "@base-ui-components/react";
import { useRouter } from "next/router";
import { FormEventHandler, useEffect, useRef, useState } from "react";

const pagesWithContextualSearch: string[] = ["/document/[id]", "/documents/[id]", "/geographies/[id]"];

export const NavSearch = () => {
  const ref = useRef(null);
  const router = useRouter();
  const queryString = router.query[QUERY_PARAMS.query_string] as string;
  const { pathname } = router;

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const pageHasContextualSearch = pagesWithContextualSearch.includes(pathname);
  const [searchEverything, setSearchEverything] = useState<boolean>(!pageHasContextualSearch);
  const showDropdown = pageHasContextualSearch;
  const showResults = isFocused && search;

  useEffect(() => {
    setSearch(queryString || "");
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

  let contextualSearchName = "Document";
  if (pathname === "/geographies/[id]") contextualSearchName = "Geography";

  const handleSearch = () => {
    const newQuery = CleanRouterQuery({ ...router.query });
    newQuery[QUERY_PARAMS.query_string] = search;

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
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="relative" ref={ref}>
      <div className="p-4 relative z-20">
        <form onSubmit={onSubmit} className="flex flex-row">
          {/* Search field */}
          <Input
            clearable
            containerClasses={`focus-within:!outline-0 ${showDropdown ? "rounded-r-none border-r border-r-border-light" : ""}`}
            icon={
              <button type="submit" className="w-4 h-4 ml-2">
                <Icon name="search" />
              </button>
            }
            iconOnLeft
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search"
            size="large"
            value={search}
            valueSetter={setSearch}
          />

          {/* Dropdown */}
          {showDropdown && (
            <Select.Root defaultValue={searchEverything} onValueChange={(value) => setSearchEverything(value)}>
              <Select.Trigger className="pl-3 pr-4 flex items-center bg-surface-ui rounded-r-md text-text-secondary text-sm leading-4 font-medium gap-2 cursor-pointer">
                <Select.Value />
                <Select.Icon>
                  <Icon name="downChevron" height="12" width="12" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner side="bottom" align="start">
                  <Select.Popup className="box-border p-0.5 bg-surface-bg rounded-md">
                    <Select.Item value={true} className="pl-3 pr-8 h-[47px] flex items-center cursor-pointer">
                      <Select.ItemText className="my-2 text-text-secondary text-sm leading-4 font-medium">Everything</Select.ItemText>
                    </Select.Item>
                    <Select.Item value={false} className="pl-3 pr-8 h-[47px] flex items-center cursor-pointer">
                      <Select.ItemText className="my-2 text-text-secondary text-sm leading-4 font-medium">{contextualSearchName}</Select.ItemText>
                    </Select.Item>
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
          <Button
            className="inline-block w-full text-left text-base font-normal"
            color="mono"
            size="small"
            variant="ghost"
            onClick={() => handleSearch()}
          >
            Search for <span className="font-bold">{search}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
