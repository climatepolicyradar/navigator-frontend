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
import { v1GeoSlugToV2 } from "@/utils/geography";
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
  const litigationIsEnabled = isLitigationEnabled(featureFlags, themeConfig);

  const id = context.params.id;
  // TODO: remove the workaround for the US
  const slug = v1GeoSlugToV2(id instanceof Array ? id[0] : id);

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
    let geographies: TGeography[] = [];
    const configData = await backendApiClient.getConfig();
    const response_geo = extractNestedData<TGeography>(configData.data?.geographies || []);
    geographies = [...response_geo[1], ...response_geo[2]];
    const geography = getCountryCode(id as string, geographies);

    if (geography) {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/geographies/${geography.toLowerCase()}.json`);
      targetsData = targetsRaw.data;
    }
  } catch {
    // TODO: handle error more elegantly
  }

  let geographyV2: GeographyV2;
  let parentGeographyV2: GeographyV2 = null;
  try {
    const geographyV2Data = await apiClient.get<ApiItemResponse<GeographyV2>>(`/geographies/${slug}`);
    geographyV2 = geographyV2Data.data.data;

    if (geographyV2.subconcept_of[0]) {
      const parentGeographyV2Data = await apiClient.get<ApiItemResponse<GeographyV2>>(`/geographies/${geographyV2.subconcept_of[0].slug}`);
      parentGeographyV2 = parentGeographyV2Data.data.data;
    }
  } catch {}

  if (geographyV2 && geographyV2.type === "region") {
    return { notFound: true };
  }

  // TODO:
  // Frontend
  // fetch geo from geographies API
  // use response to fetch families data from families API

  if (!geographyV2 || !summaryData) {
    return { notFound: true };
  }

  const vespaSearchOnGeographiesEnabled = isVespaSearchOnGeographiesEnabled(featureFlags, themeConfig);
  let vespaSearchResults: TSearch = null;
  if (vespaSearchOnGeographiesEnabled) {
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
      geographyV2,
      parentGeographyV2,
      summary: summaryData,
      targets: theme === "mcf" ? [] : targetsData,
      theme,
      themeConfig,
      vespaSearchResults: vespaSearchResults,
    }),
  };
};
