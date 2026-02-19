import { ApiClient } from "@/api/http-common";
import { DEFAULT_DOCUMENT_TITLE } from "@/constants/document";
import {
  TApiDocumentPage,
  TApiFamilyPublic,
  TApiItemResponse,
  TApiSearchResponse,
  TApiSlugResponse,
  TDocumentPresentationalResponse,
  TFeatures,
} from "@/types";
import { extractTopicIds } from "@/utils/extractTopicIds";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";

import { documentTransformer } from "../transformers/documentTransformer";

// TODO: remove this ESLint disable when the features object is used for data source switching
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  let family: TApiFamilyPublic;
  let document: TApiDocumentPage;
  try {
    const { data: returnedDocumentData } = await apiClient.get(`/families/documents/${slugResponse.family_document_import_id}`);
    const { family: familyData, ...otherDocumentData } = returnedDocumentData.data;
    family = familyData;
    document = otherDocumentData;
    if (document.title === "") document.title = DEFAULT_DOCUMENT_TITLE;
  } catch (error) {
    errors.push(new Error("Failed to fetch document data", error));
    return { data: null, errors };
  }

  /**
   * TODO:
   * - Check family data + features to determine if new data model API calls are needed
   * - Branch the API calls from this point onwards
   * - Reconverge before the transformer
   */

  if (!family || !document) {
    errors.push(new Error("No family or document data found"));
    return { data: null, errors };
  }

  let vespaDocumentData: TApiSearchResponse;
  try {
    const { data } = await backendApiClient.get<TApiSearchResponse>(`/document/${document.import_id}`);
    vespaDocumentData = data;
  } catch (error) {
    errors.push(new Error("Failed to fetch data from Vespa", error));
    return { data: null, errors };
  }

  const topicsData = await fetchAndProcessTopics(extractTopicIds(vespaDocumentData));

  /* Transform API data for presentation */

  return documentTransformer({ document, family, topicsData, vespaDocumentData }, errors);
};
