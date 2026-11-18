import { ApiClient } from "@/api/http-common";
import { documentTransformer } from "@/bff/transformers/documentTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { TApiItemResponse, TDocumentPresentationalResponse } from "@/types";

export const getDocumentData = async (slug: string): Promise<TDocumentPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let document: TDataInDocument;
  try {
    const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/slug/${slug}`);
    document = validateDataInDocument(dataInDocumentResponse.data);
  } catch (error) {
    errors.push(new Error("Failed to fetch document data", error));
    return { data: null, errors };
  }

  /* Transform API data for presentation */

  return documentTransformer({ document }, errors);
};
