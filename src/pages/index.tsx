import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useUpdateCountries from "@hooks/useUpdateCountries";
import useConfig from "@hooks/useConfig";
import Layout from "@components/layouts/LandingPage";
import { QUERY_PARAMS } from "@constants/queryParams";

import CPRLandingPage from "@cpr/pages/landing-page";
import CCLWLandingPage from "@cclw/pages/landing-page";

import { ThemeContext } from "@context/ThemeContext";
import { triggerNewSearch } from "@utils/triggerNewSearch";

const { default: Homepage } = await import(`/themes/${process.env.BUILDTIME_TEST}/pages/Homepage`);

const IndexPage = () => {
  const { t } = useTranslation(["searchStart", "searchResults"]);
  const router = useRouter();
  const { mutate: updateCountries } = useUpdateCountries();
  const theme = useContext(ThemeContext);

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
      {/* <Layout title={t("Law and Policy Search")}>
        {theme === "cpr" && (
          <CPRLandingPage
            handleSearchInput={handleSearchInput}
            handleSearchChange={handleSearchChange}
            searchInput={(router.query[QUERY_PARAMS.query_string] as string) ?? ""}
            exactMatch={router.query[QUERY_PARAMS.exact_match] === "true"}
          />
        )}
        {theme === "cclw" && (
          <CCLWLandingPage handleSearchInput={handleSearchInput} searchInput={(router.query[QUERY_PARAMS.query_string] as string) ?? ""} />
        )}
      </Layout> */}
      <Homepage handleSearchInput={handleSearchInput} searchInput={(router.query[QUERY_PARAMS.query_string] as string) ?? ""} testIgnore="123" />
    </>
  );
};

export default IndexPage;
