import { ApiClient } from "@/api/http-common";
import { collectionTransformer } from "@/bff/transformers/collectionTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { TApiCollectionPublicWithFamilies, TApiItemResponse, TApiSlugResponse, TCollectionPresentationalResponse, TFeatures } from "@/types";

import { getChildDocuments } from "./getRelations";

export const getCollectionData = async (slug: string, features: TFeatures): Promise<TCollectionPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let slugResponse: TApiSlugResponse;
  try {
    const { data: slugData } = await apiClient.get<TApiItemResponse<TApiSlugResponse>>(`/families/slugs/${slug}`);
    slugResponse = slugData.data;
  } catch (error) {
    errors.push(new Error("Failed to query collection slug", error));
    return { data: null, errors };
  }

  let collection: TApiCollectionPublicWithFamilies;
  try {
    const { data: collectionResponse } = await apiClient.get<TApiItemResponse<TApiCollectionPublicWithFamilies>>(
      `/families/collections/${slugResponse.collection_import_id}`
    );
    collection = collectionResponse.data;
  } catch (error) {
    errors.push(new Error("Failed to fetch collection data", error));
    return { data: null, errors };
  }

  if (!collection) {
    errors.push(new Error("No collection data found"));
    return { data: null, errors };
  }

  // Get the new data-in document for this collection and its families or fall back to the older data
  let dataInCollection: TDataInDocument | null = null;
  let dataInFamilies: TDataInDocument[] | null = null;

  if (features["new-data-model"]) {
    try {
      const { data: dataInCollectionResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.collection_import_id}`);
      dataInCollection = validateDataInDocument(dataInCollectionResponse.data);
    } catch (error) {
      errors.push(error as Error);
    }

    const collectionFamilies = getChildDocuments(dataInCollection.documents, "Litigation");

    try {
      dataInFamilies = await Promise.all<TDataInDocument>(
        collectionFamilies.map(async ({ value: collectionFamily }) => {
          const { data: dataInFamilyResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${collectionFamily.id}`);
          return validateDataInDocument(dataInFamilyResponse.data);
        })
      );
    } catch (error) {
      errors.push(error as Error);
    }
  }

  /* Transform API data for presentation */

  return collectionTransformer({ collection }, { collection: dataInCollection, families: dataInFamilies }, errors);
};
