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

const IndexPage = () => {
  const { t } = useTranslation(["searchStart", "searchResults"]);
  const router = useRouter();
  const { mutate: updateCountries } = useUpdateCountries();
  const theme = useContext(ThemeContext);

  const configQuery = useConfig("config");
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const handleSearchInput = (term: string, filter?: string, filterValue?: string) => {
    const newQuery = {};
    if (term && term !== "") {
      newQuery[QUERY_PARAMS.query_string] = term;
    } else {
      delete router.query[QUERY_PARAMS.query_string];
    }
    if (filter && filterValue && filter.length && filterValue.length) {
      newQuery[filter] = [filterValue.toLowerCase()];
    }
    if (router.query[QUERY_PARAMS.exact_match] === "true") {
      newQuery[QUERY_PARAMS.exact_match] = "true";
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
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
      <Layout title={t("Law and Policy Search")}>
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
      </Layout>
    </>
  );
};

export default IndexPage;
