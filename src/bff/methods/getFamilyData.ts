import { ApiClient } from "@/api/http-common";
import { getParentDocuments } from "@/bff/methods/getRelations";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { IApiFamilyDocumentTopics, ISearchDocumentResponse, TApiItemResponse, TFamilyPresentationalResponse } from "@/types";
import { processSearchDocumentTopics } from "@/utils/topics/processSearchDocumentTopics";

export const getFamilyData = async (slug: string): Promise<TFamilyPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let family: TDataInDocument;
  try {
    const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/slug/${slug}`);
    family = validateDataInDocument(dataInDocumentResponse.data);
  } catch (error) {
    errors.push(new Error("Failed to fetch family data", error));
    return { data: null, errors };
  }

  let collections: TDataInDocument[];
  try {
    const familyCollections = getParentDocuments(family.documents || []);

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

  let familyTopics: IApiFamilyDocumentTopics;
  try {
    const documentApiResponse = await apiClient.get<ISearchDocumentResponse>(`/search/documents/${family.id}`);
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    if (documentApiResponse?.status === 200) {
      familyTopics = await processSearchDocumentTopics(documentApiResponse.data.data);
    } else if (documentApiResponse?.status === 500) {
      errors.push(new Error("Failed to fetch family topics data"));
    }
  } catch (error) {
    errors.push(new Error("Failed to fetch family topics data", error));
  }

  /* Transform API data for presentation */

  return familyTransformer(
    {
      collections,
      family,
      familyTopics: familyTopics || null,
    },
    errors
  );
};
