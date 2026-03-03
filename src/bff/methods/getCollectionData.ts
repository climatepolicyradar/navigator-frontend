import { ApiClient } from "@/api/http-common";
import { TApiCollectionPublicWithFamilies, TApiItemResponse, TApiSlugResponse, TCollectionPresentationalResponse, TFeatures } from "@/types";

import { collectionTransformer } from "../transformers/collectionTransformer";

// TODO: remove this ESLint disable when the features object is used for data source switching
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * TODO:
   * - Check collection data + features to determine if new data model API calls are needed
   * - Branch the API calls from this point onwards
   * - Reconverge before the transformer
   */

  /* Transform API data for presentation */

  return collectionTransformer({ collection }, errors);
};
