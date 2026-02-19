import axios from "axios";

import { ApiClient } from "@/api/http-common";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { DEFAULT_DOCUMENT_TITLE } from "@/constants/document";
import { EXCLUDED_ISO_CODES } from "@/constants/geography";
import {
  IApiFamilyDocumentTopics,
  TApiCollectionPublicWithFamilies,
  TApiFamilyPublic,
  TApiGeography,
  TApiGeographySubdivision,
  TApiItemResponse,
  TApiSearchResponse,
  TApiSlugResponse,
  TApiTarget,
  TCorpusTypeDictionary,
  TFamilyPresentationalResponse,
  TFeatures,
} from "@/types";
import { isCorpusIdAllowed } from "@/utils/checkCorpusAccess";
import { extractNestedData } from "@/utils/extractNestedData";
import { processFamilyTopics } from "@/utils/topics/processFamilyTopics";

// TODO: remove this ESLint disable when the features object is used for data source switching
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFamilyData = async (slug: string, features: TFeatures): Promise<TFamilyPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const backendApiClient = new ApiClient(process.env.BACKEND_API_URL);
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let slugResponse: TApiSlugResponse;
  try {
    // As the families API cannot be queried by slugs, we need to get the slugResponse
    const { data: slugData } = await apiClient.get<TApiItemResponse<TApiSlugResponse>>(`/families/slugs/${slug}`);
    slugResponse = slugData.data;
  } catch (error) {
    errors.push(new Error("Failed to query family slug", error));
    return { data: null, errors };
  }

  let family: TApiFamilyPublic;
  try {
    // and then query the families API by the returned family_import_id
    const { data: familyResponse } = await apiClient.get<TApiItemResponse<TApiFamilyPublic>>(`/families/${slugResponse.family_import_id}`);
    family = familyResponse.data;
    family.documents.forEach((document) => {
      if (document.title === "") document.title = DEFAULT_DOCUMENT_TITLE;
    });
  } catch (error) {
    errors.push(new Error("Failed to fetch families data", error));
    return { data: null, errors };
  }

  /**
   * TODO:
   * - Check family data + features to determine if new data model API calls are needed
   * - Branch the API calls from this point onwards
   * - Reconverge before the transformer
   */

  // The Vespa families data has the concepts data attached, which is why we need this
  let vespaFamilyData: TApiSearchResponse;
  try {
    // max_hits_per_family=100 is set ensure we get all documents for a family
    // this should probably be done in the `backend-api`, but it currently does not work
    const { data: vespaFamilyDataRaw } = await backendApiClient.get<TApiSearchResponse>(`/families/${family.import_id}?max_hits_per_family=100`);
    vespaFamilyData = vespaFamilyDataRaw;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      errors.push(new Error("Failed to fetch Vespa families data", error));
    }
  }

  // Package the family topics
  let familyTopics: IApiFamilyDocumentTopics;
  if (vespaFamilyData) familyTopics = await processFamilyTopics(vespaFamilyData);

  const configRaw = await backendApiClient.getConfig();
  const response_geo = extractNestedData<TApiGeography>(configRaw.data.geographies);
  const countries = response_geo[1];
  const corpus_types: TCorpusTypeDictionary = configRaw.data.corpus_types;

  // This is because our family.geographies field isn't hydrated but rather a string[]
  const allSubdivisions = await Promise.all<TApiGeographySubdivision[]>(
    family.geographies
      .filter((country) => country.length === 3 && !EXCLUDED_ISO_CODES.includes(country))
      .map(async (country) => {
        try {
          const { data: subDivisionResponse } = await apiClient.get<TApiGeographySubdivision[]>(`/geographies/subdivisions/${country}`);
          return subDivisionResponse;
        } catch (error) {
          errors.push(new Error("Failed to fetch subdivisions data for country: " + country, error));
        }
      })
  );
  const subdivisions = allSubdivisions.flat().filter((subdivision) => subdivision !== undefined);

  const allCollections = await Promise.all<TApiCollectionPublicWithFamilies[]>(
    family.collections.map(async (collection) => {
      try {
        const { data: collectionResponse } = await apiClient.get(`/families/collections/${collection.import_id}`);
        return collectionResponse.data;
      } catch (error) {
        errors.push(new Error("Failed to fetch collection data for collection: " + collection.import_id, error));
      }
    })
  );
  const collections = allCollections.flat();

  let targets: TApiTarget[] = [];
  try {
    const targetsRaw = await axios.get<TApiTarget[]>(`${process.env.TARGETS_URL}/families/${family.import_id}.json`);
    targets = targetsRaw.data;
  } catch (error) {
    // Targets store in S3 are not available for the majority of families, so we fail silently
    // Otherwise the logs are flooded with 404s and 403s
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      errors.push(new Error("Failed to fetch target data", error));
    }
  }

  // Check the family is in the "allowed_corpora"
  if (family.corpus?.import_id && !isCorpusIdAllowed(process.env.BACKEND_API_TOKEN, family.corpus.import_id)) {
    errors.push(new Error("Family is not in an allowed corpora"));
    return { data: null, errors };
  }

  /* Transform API data for presentation */

  return familyTransformer(
    {
      collections,
      corpus_types,
      countries,
      family,
      familyTopics: familyTopics || null,
      subdivisions,
      targets,
      vespaFamilyData: vespaFamilyData || null,
    },
    errors
  );
};
