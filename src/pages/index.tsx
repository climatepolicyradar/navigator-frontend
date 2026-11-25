import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { Homepage } from "@/components/Themed";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import useConfig from "@/hooks/useConfig";
import useUpdateCountries from "@/hooks/useUpdateCountries";
import themeConfig from "@/themes/config";
import { TFeatures, TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { triggerNewSearch } from "@/utils/triggerNewSearch";

interface IProps {
  features: TFeatures;
  theme: TTheme;
}

const IndexPage = ({ features, theme }: IProps) => {
  const router = useRouter();
  const { mutate: updateCountries } = useUpdateCountries();

  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const handleSearchInput = (term: string, filter?: string, filterValue?: string) => {
    triggerNewSearch(router, term, filter, filterValue);
  };

  const handleSearchChange = (type: string, value: any) => {
    // Handle exact_match specially - only include when false
    if (type === QUERY_PARAMS.exact_match) {
      if (value === false) {
        router.query[type] = "false";
      } else {
        delete router.query[type];
      }
    } else {
      router.query[type] = [value];
    }
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
    <FeaturesContext.Provider value={features}>
      <Homepage
        handleSearchInput={handleSearchInput}
        handleSearchChange={handleSearchChange}
        searchInput={(router.query[QUERY_PARAMS.query_string] as string) ?? ""}
        exactMatch={router.query[QUERY_PARAMS.exact_match] !== "false"}
        theme={theme}
      />
    </FeaturesContext.Provider>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME as TTheme;
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  return {
    props: withEnvConfig({
      features,
      theme,
    }),
  };
};
