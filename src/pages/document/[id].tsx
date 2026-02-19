import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { FamilyPage as FamilyPageUI } from "@/components/pages/familyPage";
import { DEFAULT_DOCUMENT_TITLE } from "@/constants/document";
import { EXCLUDED_ISO_CODES } from "@/constants/geography";
import { withEnvConfig } from "@/context/EnvConfig";
import {
  IFamilyDocumentTopics,
  TCollectionPublicWithFamilies,
  TCorpusTypeDictionary,
  TFamilyPublic,
  TGeography,
  TGeographySubdivision,
  TSearchResponse,
  TSlugResponse,
  TTarget,
  TTheme,
} from "@/types";
import { isCorpusIdAllowed } from "@/utils/checkCorpusAccess";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";
import { processFamilyTopics } from "@/utils/topics/processFamilyTopics";

/*
  # DEV NOTES
  - This page displays a single document family and its associated documents, meta data, targets, and events.
  - Families can contain multiple documents, often referred to as 'physical documents'.
  - The 'physical document' view is within the folder: src/pages/documents/[id].tsx.
*/

const FamilyPage = ({ ...props }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <FamilyPageUI {...props} />;
};

export default FamilyPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

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
    familyData.documents.forEach((document) => {
      if (document.title === "") document.title = DEFAULT_DOCUMENT_TITLE;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching families data", error);
    return {
      notFound: true,
    };
  }

  /** The Vespa families data has the concepts data attached, which is why we need this */
  let vespaFamilyData: TSearchResponse | null = null;
  try {
    // max_hits_per_family=100 is set ensure we get all documents for a family
    // this should probably be done in the `backend-api`, but it currently does not work
    const { data: vespaFamilyDataRaw } = await backendApiClient.get<TSearchResponse>(`/families/${familyData.import_id}?max_hits_per_family=100`);
    vespaFamilyData = vespaFamilyDataRaw;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      // eslint-disable-next-line no-console
      console.error("Error fetching vespa families data", error);
    }
  }

  /* Package the family topics */
  let familyTopics: IFamilyDocumentTopics | null = null;
  if (vespaFamilyData) familyTopics = await processFamilyTopics(vespaFamilyData);

  /** TODO: see where we use this config data, and if we can get it from the families response */
  const configRaw = await backendApiClient.getConfig();
  const response_geo = extractNestedData<TGeography>(configRaw.data.geographies);
  const countriesData = response_geo[1];
  const corpus_types: TCorpusTypeDictionary = configRaw.data.corpus_types;

  /** This is because our family.geographies field isn't hydrated but rather a string[] */
  const allSubdivisions = await Promise.all<TGeographySubdivision[]>(
    familyData.geographies
      .filter((country) => country.length === 3 && !EXCLUDED_ISO_CODES.includes(country))
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

  const allCollections = await Promise.all<TCollectionPublicWithFamilies[]>(
    familyData.collections.map(async (collection) => {
      try {
        const { data: collectionResponse } = await apiClient.get(`/families/collections/${collection.import_id}`);
        return collectionResponse.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching collection data", error);
      }
    })
  );
  const collectionsData = allCollections.flat();

  let targetsData: TTarget[] = [];
  try {
    const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/families/${familyData.import_id}.json`);
    targetsData = targetsRaw.data;
  } catch (error) {
    // Targets store in S3 are not available for the majority of families, so we fail silently
    // Otherwise the logs are flooded with 404s and 403s
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      // eslint-disable-next-line no-console
      console.error("Error fetching targets data", error);
    }
  }

  /** Check the family is in the "allowed_corpora" */
  if (familyData.corpus?.import_id && !isCorpusIdAllowed(process.env.BACKEND_API_TOKEN, familyData.corpus.import_id)) {
    return {
      notFound: true,
    };
  }

  return {
    props: withEnvConfig({
      collections: collectionsData,
      corpus_types,
      countries: countriesData,
      family: familyData,
      familyTopics: familyTopics,
      features,
      subdivisions: subdivisionsData,
      targets: targetsData,
      theme,
      themeConfig,
      vespaFamilyData: vespaFamilyData,
    }),
  };
}) satisfies GetServerSideProps;
