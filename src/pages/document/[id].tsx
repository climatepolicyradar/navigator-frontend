import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

import { ApiClient } from "@/api/http-common";
import { FamilyLitigationPage } from "@/components/pages/familyLitigationPage";
import { FamilyOriginalPage, IProps } from "@/components/pages/familyOriginalPage";
import { withEnvConfig } from "@/context/EnvConfig";
import { TCorpusTypeDictionary, TFamilyPublic, TGeography, TGeographySubdivision, TSearchResponse, TSlugResponse, TTarget } from "@/types";
import { isCorpusIdAllowed } from "@/utils/checkCorpusAccess";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled, isLitigationEnabled } from "@/utils/features";
import { getLanguage } from "@/utils/getLanguage";
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

  let slug: TSlugResponse;
  try {
    /** As the families API cannot be queried by slugs, we need to get the slug */
    const { data: slugData } = await apiClient.get(`/families/slugs/${id}`);
    slug = slugData.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching slug data", error);
    return {
      notFound: true,
    };
  }

  let familyData: TFamilyPublic;
  try {
    /** and then query the families API by the returned family_import_id */
    const { data: familyResponse } = await apiClient.get(`/families/${slug.family_import_id}`);
    familyData = familyResponse.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching families data", error);
    return {
      notFound: true,
    };
  }

  /** The Vespa families data has the concepts data attached, which is why we need this */
  let vespaFamilyData: TSearchResponse;
  try {
    if (knowledgeGraphEnabled) {
      const { data: vespaFamilyDataResponse } = await backendApiClient.get(`/families/${familyData.import_id}`);
      vespaFamilyData = vespaFamilyDataResponse;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching vespa family data", error);
  }

  /** TODO: see where we use this config data, and if we can get it from the families response */
  const configRaw = await backendApiClient.getConfig();
  const response_geo = extractNestedData<TGeography>(configRaw.data.geographies);
  const countriesData = response_geo[1];
  const corpus_types: TCorpusTypeDictionary = configRaw.data.corpus_types;

  /** This is because our family.geographies field isn't hydrated but rather a string[] */
  const allSubdivisions = await Promise.all<TGeographySubdivision[]>(
    familyData.geographies
      .filter((country) => country.length === 3 && !["XAA", "XAB"].includes(country))
      .map(async (country) => {
        try {
          const { data: subDivisionResponse } = await apiClient.get(`/geographies/subdivisions/${country}`);
          return subDivisionResponse;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Error fetching subdivisions data", error);
        }
      })
  );
  const subdivisionsData = allSubdivisions.flat().filter((subdivision) => subdivision !== undefined);

  /** targets data may or may not exist, so if we have a network error, we fail silently */
  let targetsData: TTarget[] = [];
  try {
    const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/families/${familyData.import_id}.json`);
    targetsData = targetsRaw.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching targets data", error);
  }

  /** Check the family is in the "allowed_corpora" */
  if (familyData.corpus?.import_id && !isCorpusIdAllowed(process.env.BACKEND_API_TOKEN, familyData.corpus.import_id)) {
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
