import { ApiClient } from "@/api/http-common";
import { documentTransformer } from "@/bff/transformers/documentTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { TApiItemResponse, TApiSearchResponse, TApiSlugResponse, TDocumentPresentationalResponse, TFeatures } from "@/types";
import { extractTopicIds } from "@/utils/extractTopicIds";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";

export const getDocumentData = async (slug: string, features: TFeatures): Promise<TDocumentPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const backendApiClient = new ApiClient(process.env.BACKEND_API_URL);
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let slugResponse: TApiSlugResponse;
  try {
    const { data: slugData } = await apiClient.get<TApiItemResponse<TApiSlugResponse>>(`/families/slugs/${slug}`);
    slugResponse = slugData.data;
  } catch (error) {
    errors.push(new Error("Failed to query document slug", error));
    return { data: null, errors };
  }

  let document: TDataInDocument;
  if (features["new-data-model"]) {
    try {
      const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.family_document_import_id}`);
      document = validateDataInDocument(dataInDocumentResponse.data);
    } catch (error) {
      errors.push(new Error("Failed to fetch document data", error));
      return { data: null, errors };
    }
  }

  let vespaDocumentData: TApiSearchResponse;
  try {
    const { data } = await backendApiClient.get<TApiSearchResponse>(`/document/${document.id}`);
    vespaDocumentData = data;
  } catch (error) {
    errors.push(new Error("Failed to fetch data from Vespa", error));
    return { data: null, errors };
  }

  const topicsData = await fetchAndProcessTopics(extractTopicIds(vespaDocumentData));

  /* Transform API data for presentation */

  return documentTransformer({ document, topicsData, vespaDocumentData }, errors);
};
