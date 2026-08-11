import { ApiClient } from "@/api/http-common";
import { getParentDocuments } from "@/bff/methods/getRelations";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { IApiFamilyDocumentTopics, TApiItemResponse, TApiSearchResponse, TApiSlugResponse, TFamilyPresentationalResponse } from "@/types";
import { processFamilyTopics } from "@/utils/topics/processFamilyTopics";

export const getFamilyData = async (slug: string, importId?: string): Promise<TFamilyPresentationalResponse> => {
  /* Make API requests */

  const errors: Error[] = [];
  const backendApiClient = new ApiClient(process.env.BACKEND_API_URL);
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

  // The Vespa families data has the concepts data attached, which is why we need this
  let vespaFamilyData: TApiSearchResponse;
  try {
    // max_hits_per_family=100 is set ensure we get all documents for a family
    // this should probably be done in the `backend-api`, but it currently does not work
    const vespaResponse = await backendApiClient.get<TApiSearchResponse>(`/families/${family.id}?max_hits_per_family=100`);
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    if (vespaResponse?.status === 200) {
      vespaFamilyData = vespaResponse.data;
    } else if (vespaResponse?.status === 500) {
      errors.push(new Error("Failed to fetch Vespa families data"));
    }
  } catch (error) {
    errors.push(new Error("Failed to fetch Vespa families data", error));
  }

  // Package the family topics
  let familyTopics: IApiFamilyDocumentTopics;
  if (vespaFamilyData) familyTopics = await processFamilyTopics(vespaFamilyData);

  /* Transform API data for presentation */

  return familyTransformer(
    {
      collections,
      family,
      familyTopics: familyTopics || null,
      vespaFamilyData: vespaFamilyData || null,
    },
    errors
  );
};
