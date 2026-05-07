import { ApiClient } from "@/api/http-common";
import { documentTransformer } from "@/bff/transformers/documentTransformer";
import { DEFAULT_DOCUMENT_TITLE } from "@/constants/document";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import {
  TApiDocumentPublic,
  TApiItemResponse,
  TApiSearchResponse,
  TApiSlugResponse,
  TDocumentPresentationalResponse,
  TFeatures,
  TTopics,
} from "@/types";
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

  let document: TApiDocumentPublic;
  try {
    const { data: documentResponse } = await apiClient.get<TApiItemResponse<TApiDocumentPublic>>(
      `/families/documents/${slugResponse.family_document_import_id}`
    );
    document = documentResponse.data;
    if (document.title === "") document.title = DEFAULT_DOCUMENT_TITLE;
  } catch (error) {
    errors.push(new Error("Failed to fetch document data", error));
    return { data: null, errors };
  }

  if (!document || !document.family) {
    errors.push(new Error("No family or document data found"));
    return { data: null, errors };
  }

  // Get the new data-in document for this document's family or fall back to the older data
  let dataInDocument: TDataInDocument | null = null;
  if (features["new-data-model"]) {
    try {
      const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${slugResponse.family_document_import_id}`);
      dataInDocument = validateDataInDocument(dataInDocumentResponse.data);
    } catch (error) {
      errors.push(error as Error);
    }
  }

  let vespaDocumentData: TApiSearchResponse;
  try {
    const vespaResponse = await backendApiClient.get<TApiSearchResponse>(`/document/${document.import_id}`);
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    if (vespaResponse?.status === 200) {
      vespaDocumentData = vespaResponse.data;
    } else if (vespaResponse?.status === 500) {
      errors.push(new Error("Failed to fetch Vespa document data"));
    }
  } catch (error) {
    errors.push(new Error("Failed to fetch Vespa document data", error));
  }

  let topicsData: TTopics;
  if (vespaDocumentData) topicsData = await fetchAndProcessTopics(extractTopicIds(vespaDocumentData));

  /* Transform API data for presentation */

  return documentTransformer({ document, topicsData, vespaDocumentData }, dataInDocument, errors);
};
