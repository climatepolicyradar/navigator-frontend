import { ApiClient } from "@/api/http-common";
import { collectionTransformer } from "@/bff/transformers/collectionTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { TApiItemResponse, TApiSlugResponse, TAttributionCategory, TCollectionPresentationalResponse } from "@/types";

import { getChildDocuments } from "./getRelations";

export const getCollectionData = async (slug: string): Promise<TCollectionPresentationalResponse> => {
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

  let collection: TDataInDocument;
  try {
    const { data: dataInCollectionResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.collection_import_id}`);
    collection = validateDataInDocument(dataInCollectionResponse.data);
  } catch (error) {
    errors.push(new Error("Failed to fetch collection data", error));
    return { data: null, errors };
  }

  let families: TDataInDocument[];
  try {
    const category: TAttributionCategory = "Litigation";

    const collectionFamilies = getChildDocuments(collection.documents, category);
    families = await Promise.all<TDataInDocument>(
      collectionFamilies.map(async ({ value: collectionFamily }) => {
        const { data: dataInFamilyResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${collectionFamily.id}`);
        return validateDataInDocument(dataInFamilyResponse.data);
      })
    );
  } catch (error) {
    errors.push(new Error("Failed to fetch families data", error));
    return { data: null, errors };
  }

  /* Transform API data for presentation */

  return collectionTransformer({ collection, families }, errors);
};
