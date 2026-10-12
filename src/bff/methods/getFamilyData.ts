import { ApiClient } from "@/api/http-common";
import { getParentDocuments } from "@/bff/methods/getRelations";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { IApiFamilyDocumentTopics, ISearchDocumentResponse, TApiItemResponse, TApiSlugResponse, TFamilyPresentationalResponse } from "@/types";
import { processSearchDocumentTopics } from "@/utils/topics/processSearchDocumentTopics";



export const getFamilyData = async (slug: string, importId?: string): Promise<TFamilyPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let familyImportId = importId;
  if (slug) {
    try {
      // As the families API cannot be queried by slugs, we need to get the slugResponse
      // http-common's get() returns error.response rather than throwing for Axios errors,
      // so we must check the status explicitly rather than relying on catch for non-2xx responses.
      const slugApiResponse = await apiClient.get<TApiItemResponse<TApiSlugResponse>>(`/families/slugs/${slug}`);
      if (slugApiResponse?.status !== 200 || !slugApiResponse.data?.data?.family_import_id) {
        errors.push(new Error("Failed to query family slug"));
        return { data: null, errors };
      }
      familyImportId = slugApiResponse.data.data.family_import_id;
    } catch (error) {
      errors.push(new Error("Failed to query family slug", error));
      return { data: null, errors };
    }
  }

  let family: TDataInDocument;
  try {
    const { data: dataInDocumentResponse } = await apiClient.get<TApiItemResponse>(`/data-in/documents/${familyImportId}`);
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
    const { data: {data: documentResponse} } = await apiClient.get<ISearchDocumentResponse>(`/search/documents/${family.id}`);
    familyTopics = await processSearchDocumentTopics(documentResponse);
    console.info(familyTopics)
  } catch (error) {
    errors.push(new Error("Failed to fetch family topics data", error));
    return { data: null, errors };
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
