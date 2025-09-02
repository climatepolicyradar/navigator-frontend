import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { GeographyLitigationPage } from "@/components/pages/geographyLitigationPage";
import { GeographyOriginalPage, IProps } from "@/components/pages/geographyOriginalPage";
import { systemGeoNames } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode } from "@/helpers/getCountryFields";
import { ApiItemResponse, GeographyV2, TGeographySummary, TSearch } from "@/types";
import { TTarget, TGeography } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled, isVespaSearchOnGeographiesEnabled } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ featureFlags, themeConfig, ...props }: IProps) => {
  const litigationIsEnabled = isLitigationEnabled(featureFlags, themeConfig);
  const PageComponent = litigationIsEnabled ? GeographyLitigationPage : GeographyOriginalPage;
  return <PageComponent featureFlags={featureFlags} themeConfig={themeConfig} {...props} />;
};

export default CountryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const id = context.params.id;
  // TODO: remove the workaround for the US
  const slug = id === "united-states-of-america" ? "united-states" : id;

  if (systemGeoNames.includes(id as string)) {
    return {
      notFound: true,
    };
  }

  const backendApiClient = new ApiClient();
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let summaryData: TGeographySummary;
  let targetsData: TTarget[] = [];

  try {
    const { data: returnedData }: { data: TGeographySummary } = await backendApiClient.get(`/summaries/geography/${id}`);
    summaryData = returnedData;
  } catch {
    // TODO: handle error more elegantly
  }
  try {
    let countries: TGeography[] = [];
    const configData = await backendApiClient.getConfig();
    const response_geo = extractNestedData<TGeography>(configData.data?.geographies || []);
    countries = response_geo[1];
    const country = getCountryCode(id as string, countries);
    if (country) {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/geographies/${country.toLowerCase()}.json`);
      targetsData = targetsRaw.data;
    }
  } catch {
    // TODO: handle error more elegantly
  }

  let geographyV2: GeographyV2 = null;
  try {
    const geographyV2Data = await apiClient.get<ApiItemResponse<GeographyV2>>(`/geographies/${slug}`);
    geographyV2 = geographyV2Data.data.data;
  } catch {}

  // TODO:
  // Frontend
  // fetch geo from geographies API
  // use response to fetch families data from families API

  if (!geographyV2 || !summaryData) {
    return {
      notFound: true,
    };
  }

  const vespaSearchOnGeographiesEnabled = isVespaSearchOnGeographiesEnabled(featureFlags, themeConfig);
  let vespaSearchResults: TSearch = null;
  if (vespaSearchOnGeographiesEnabled || true) {
    const searchQuery = buildSearchQuery(
      {
        l: slug,
      },
      themeConfig
    );
    vespaSearchResults = await backendApiClient
      .post<TSearch>("/searches", searchQuery, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);
  }

  return {
    props: withEnvConfig({
      featureFlags,
      geographyV2: geographyV2,
      summary: summaryData,
      targets: theme === "mcf" ? [] : targetsData,
      theme,
      themeConfig,
      vespaSearchResults: vespaSearchResults,
    }),
  };
};
