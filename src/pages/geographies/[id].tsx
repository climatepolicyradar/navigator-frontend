import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { GeographyLitigationPage } from "@/components/pages/geographyLitigationPage";
import { GeographyOriginalPage, IProps } from "@/components/pages/geographyOriginalPage";
import { systemGeoNames } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode } from "@/helpers/getCountryFields";
import { ApiItemResponse, GeographyV2, TSearch } from "@/types";
import { TTarget, TGeography } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";
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

  if (systemGeoNames.includes(id as string)) {
    return {
      notFound: true,
    };
  }

  const backendApiClient = new ApiClient();
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let targetsData: TTarget[] = [];

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
    // TODO: remove the workaround for the US
    const v1Slug = Array.isArray(id) ? id[0] : id;
    const v2Slug = v1Slug === "united-states-of-america" ? "united-states" : v1Slug;
    const geographyV2Data = await apiClient.get<ApiItemResponse<GeographyV2>>(`/geographies/${v2Slug}`);
    geographyV2 = geographyV2Data.data.data;
    geographyV2.slug = v1Slug;

    if (geographyV2.subconcept_of[0]) {
      const parentGeographyV2Data = await apiClient.get<ApiItemResponse<GeographyV2>>(`/geographies/${geographyV2.subconcept_of[0].slug}`);
      parentGeographyV2 = parentGeographyV2Data.data.data;
      // TODO: remove the workaround for the US
      const parentSlug = parentGeographyV2.slug === "united-states" ? "united-states-of-america" : parentGeographyV2.slug;
      parentGeographyV2.slug = parentSlug;
    }
  } catch {}

  if (geographyV2 && geographyV2.type === "region") {
    return { notFound: true };
  }

  let vespaSearchResults: TSearch = null;
  const searchQuery = buildSearchQuery(
    {
      l: geographyV2.slug,
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

  if (!geographyV2 || !vespaSearchResults) {
    return { notFound: true };
  }

  return {
    props: withEnvConfig({
      featureFlags,
      geographyV2,
      parentGeographyV2,
      targets: theme === "mcf" ? [] : targetsData,
      theme,
      themeConfig,
      vespaSearchResults: vespaSearchResults,
    }),
  };
};
