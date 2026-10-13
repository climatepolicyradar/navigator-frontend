import { ApiClient } from "@/api/http-common";
import { SearchDocument, SearchDocumentResponse } from "@/api/search";
import { documentTransformer } from "@/bff/transformers/documentTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { TApiItemResponse, TApiSlugResponse, TDocumentPresentationalResponse, TTopics } from "@/types";
import { extractTopicIds } from "@/utils/extractTopicIds";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";

export const getDocumentData = async (slug: string): Promise<TDocumentPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let slugResponse: TApiSlugResponse;
  try {
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    const slugApiResponse = await apiClient.get<TApiItemResponse<TApiSlugResponse>>(`/families/slugs/${slug}`);
    if (slugApiResponse?.status !== 200 || !slugApiResponse.data?.data?.family_document_import_id) {
      errors.push(new Error("Failed to query document slug"));
      return { data: null, errors };
    }
    slugResponse = slugApiResponse.data.data;
  } catch (error) {
    errors.push(new Error("Failed to query document slug", error));
    return { data: null, errors };
  }

  let document: TDataInDocument;
  try {
    const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.family_document_import_id}`);
    document = validateDataInDocument(dataInDocumentResponse.data);
  } catch (error) {
    errors.push(new Error("Failed to fetch document data", error));
    return { data: null, errors };
  }

  let topicsData: TTopics;
  let searchDocument: SearchDocument;
  try {
    const { data: searchDocumentResponse } = await apiClient.get<SearchDocumentResponse>(`/search/documents/${document.id}`);
    searchDocument = searchDocumentResponse.data;
    topicsData = await fetchAndProcessTopics(extractTopicIds(searchDocumentResponse));
  } catch (error) {
    errors.push(new Error("Failed to fetch document topics data", error));
    return { data: null, errors };
  }

  /* Transform API data for presentation */

  return documentTransformer({ document, topicsData, searchDocument }, errors);
};
