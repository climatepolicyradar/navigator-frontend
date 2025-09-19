import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

import { ApiClient } from "@/api/http-common";
import { FamilyLitigationPage } from "@/components/pages/familyLitigationPage";
import { FamilyOriginalPage, IProps } from "@/components/pages/familyOriginalPage";
import { withEnvConfig } from "@/context/EnvConfig";
import { TCorpusTypeDictionary, TFamilyPage, TFamilyPublic, TGeography, TGeographySubdivision, TSearchResponse, TTarget } from "@/types";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled, isLitigationEnabled } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

/*
  # DEV NOTES
  - This page displays a single document family and its associated documents, meta data, targets, and events.
  - Families can contain multiple documents, often referred to as 'physical documents'.
  - The 'physical document' view is within the folder: src/pages/documents/[id].tsx.
*/

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ featureFlags, themeConfig, ...props }: IProps) => {
  const litigationIsEnabled = isLitigationEnabled(featureFlags, themeConfig);
  const PageComponent = litigationIsEnabled ? FamilyLitigationPage : FamilyOriginalPage;
  return <PageComponent featureFlags={featureFlags} themeConfig={themeConfig} {...props} />;
};

export default FamilyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  const id = context.params.id;
  const backendApiClient = new ApiClient(process.env.BACKEND_API_URL);
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let familyData: TFamilyPage | TFamilyPublic;
  let vespaFamilyData: TSearchResponse;
  let targetsData: TTarget[] = [];
  let countriesData: TGeography[] = [];
  let corpus_types: TCorpusTypeDictionary;
  let subdivisionsData: TGeographySubdivision[] = [];

  try {
    const { data: returnedData } = await backendApiClient.get(`/documents/${id}`);
    familyData = returnedData;

    if (knowledgeGraphEnabled) {
      // fetch the families
      const { data: vespaFamilyDataResponse } = await backendApiClient.get(`/families/${familyData.import_id}`);
      vespaFamilyData = vespaFamilyDataResponse;
      console.info("document/[id].getServerSideProps", vespaFamilyData);
    }
  } catch (error) {
    // TODO: handle error more elegantly
  }

  // We're using the new families-api for litigation work
  // This is slightly inefficient as we're making 2 API calls but we'll deprecate ☝️ once this becomes universal
  const litigationEnabled = isLitigationEnabled(featureFlags, themeConfig);
  if (litigationEnabled) {
    try {
      const { data: familyResponse } = await apiClient.get(`/families/${familyData.import_id}`);
      familyData = familyResponse.data;
    } catch (error) {}
  }

  if (familyData) {
    try {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/families/${familyData.import_id}.json`);
      targetsData = targetsRaw.data;
    } catch (error) {}
  }

  if (familyData) {
    try {
      const configRaw = await backendApiClient.getConfig();
      const response_geo = extractNestedData<TGeography>(configRaw.data.geographies);
      countriesData = response_geo[1];
      corpus_types = configRaw.data.corpus_types;
    } catch (error) {}
  }

  if (familyData) {
    const allSubdivisions = await Promise.all<TGeographySubdivision[]>(
      familyData.geographies
        .filter((country) => country.length === 3 && !["XAA", "XAB"].includes(country))
        .map(async (country) => {
          try {
            const { data: subDivisionResponse } = await apiClient.get(`/geographies/subdivisions/${country}`);
            return subDivisionResponse;
          } catch (error) {}
        })
    );
    subdivisionsData = allSubdivisions.flat().filter((subdivision) => subdivision !== undefined);
  }

  if (!familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: withEnvConfig({
      corpus_types,
      countries: countriesData,
      family: familyData,
      featureFlags,
      subdivisions: subdivisionsData,
      targets: targetsData,
      theme,
      themeConfig,
      vespaFamilyData: vespaFamilyData ?? null,
    }),
  };
};
