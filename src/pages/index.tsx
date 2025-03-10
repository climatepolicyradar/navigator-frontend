import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { TProps as HomepageProps } from "@/cpr/pages/homepage";
import useConfig from "@/hooks/useConfig";
import useUpdateCountries from "@/hooks/useUpdateCountries";
import { triggerNewSearch } from "@/utils/triggerNewSearch";

const Homepage = dynamic<HomepageProps>(() => import(`/themes/${process.env.THEME}/pages/homepage`));

const IndexPage = () => {
  const router = useRouter();
  const { mutate: updateCountries } = useUpdateCountries();

  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const handleSearchInput = (term: string, filter?: string, filterValue?: string) => {
    triggerNewSearch(router, term, filter, filterValue);
  };

  const handleSearchChange = (type: string, value: any) => {
    router.query[type] = [value];
    router.push({ query: router.query });
  };

  useEffect(() => {
    updateCountries({
      regionName: "",
      regions,
      countries,
    });
  }, [updateCountries, regions, countries]);

  return (
    <>
      <Homepage
        handleSearchInput={handleSearchInput}
        handleSearchChange={handleSearchChange}
        searchInput={(router.query[QUERY_PARAMS.query_string] as string) ?? ""}
        exactMatch={router.query[QUERY_PARAMS.exact_match] === "true"}
      />
    </>
  );
};

export default IndexPage;
