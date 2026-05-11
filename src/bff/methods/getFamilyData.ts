import axios from "axios";

import { ApiClient } from "@/api/http-common";
import { getParentDocuments } from "@/bff/methods/getRelations";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { LABEL_TYPES, TDataInDocument, TDataInLabel, TDataInLabelType, validateDataInDocument } from "@/schemas";
import {
  IApiFamilyDocumentTopics,
  TApiItemResponse,
  TApiSearchResponse,
  TApiSlugResponse,
  TApiTarget,
  TAttributionCategory,
  TFamilyPresentationalResponse,
} from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";
import { processFamilyTopics } from "@/utils/topics/processFamilyTopics";

export const getFamilyData = async (slug: string): Promise<TFamilyPresentationalResponse> => {
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

  let family: TDataInDocument;
  try {
    const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.family_import_id}`);
    family = validateDataInDocument(dataInDocumentResponse.data);
  } catch (error) {
    errors.push(new Error("Failed to fetch family data", error));
    return { data: null, errors };
  }

  let collections: TDataInDocument[];
  try {
    const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(family.labels, LABEL_TYPES, ["category"]);
    const category = groupedLabels.category[0].value.value as TAttributionCategory;
    const familyCollections = getParentDocuments(family.documents || [], category);

    collections = await Promise.all<TDataInDocument>(
      familyCollections.map(async ({ value: familyCollection }) => {
        const { data: collectionResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${familyCollection.id}`);
        return validateDataInDocument(collectionResponse.data);
      })
    );
  } catch (error) {
    errors.push(new Error("Failed to fetch collections data", error));
    return { data: null, errors };
  }

  // The Vespa families data has the concepts data attached, which is why we need this
  let vespaFamilyData: TApiSearchResponse;
  try {
    // max_hits_per_family=100 is set ensure we get all documents for a family
    // this should probably be done in the `backend-api`, but it currently does not work
    const vespaResponse = await backendApiClient.get<TApiSearchResponse>(`/families/${family.id}?max_hits_per_family=100`);
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    if (vespaResponse?.status === 200) {
      vespaFamilyData = vespaResponse.data;
    } else if (vespaResponse?.status === 500) {
      errors.push(new Error("Failed to fetch Vespa families data"));
    }
  } catch (error) {
    errors.push(new Error("Failed to fetch Vespa families data", error));
  }

  // Package the family topics
  let familyTopics: IApiFamilyDocumentTopics;
  if (vespaFamilyData) familyTopics = await processFamilyTopics(vespaFamilyData);

  let targets: TApiTarget[] = [];
  try {
    const targetsRaw = await axios.get<TApiTarget[]>(`${process.env.TARGETS_URL}/families/${family.id}.json`);
    targets = targetsRaw.data;
  } catch (error) {
    // Targets store in S3 are not available for the majority of families, so we fail silently
    // Otherwise the logs are flooded with 404s and 403s
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      errors.push(new Error("Failed to fetch target data", error));
    }
  }

  /* Transform API data for presentation */

  return familyTransformer(
    {
      collections,
      family,
      familyTopics: familyTopics || null,
      targets,
      vespaFamilyData: vespaFamilyData || null,
    },
    errors
  );
};
