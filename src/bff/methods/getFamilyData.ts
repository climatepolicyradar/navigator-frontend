import { ApiClient } from "@/api/http-common";
import { loadTaxonomy } from "@/api/taxonomy";
import { getParentDocuments } from "@/bff/methods/getRelations";
import { familyTransformer } from "@/bff/transformers/familyTransformer";
import { TDataInDocument, validateDataInDocument } from "@/schemas";
import { IFamilyDocumentTopics, ISearchDocumentResponse, TApiItemResponse, TFamilyPresentationalResponse, TSearchQueryGroup } from "@/types";
import { pruneTaxonomy } from "@/utils/filters/pruneTaxonomy";
import { flattenCountedLabels } from "@/utils/labels/flattenCountedLabels";
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

  let familyTopics: IFamilyDocumentTopics;
  try {
    const memberDocumentsFilter: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "principal_id", op: "contains", value: family.id },
        { field: "id", op: "not_contains", value: family.id },
      ],
    };
    const [documentApiResponse, taxonomy] = await Promise.all([
      apiClient.get<ISearchDocumentResponse>(`/search/documents/${family.id}`),
      loadTaxonomy(process.env.CONCEPTS_API_URL, { patterns: ["**/concept::*"], filters: memberDocumentsFilter }),
    ]);
    // http-common's get() returns error.response rather than throwing for Axios errors,
    // so we must check the status explicitly rather than relying on catch for non-2xx responses.
    if (documentApiResponse?.status === 200) {
      const topics = flattenCountedLabels(taxonomy).length > 0 ? pruneTaxonomy(taxonomy) : [];
      familyTopics = processSearchDocumentTopics(documentApiResponse.data.data, topics);
    } else if (documentApiResponse?.status === 500) {
      errors.push(new Error("Failed to fetch family topics data"));
    }
  } catch (error) {
    errors.push(new Error("Failed to fetch family topics data", error));
  }

  /* Transform API data for presentation */

  return familyTransformer({ collections, family, familyTopics: familyTopics || null }, errors);
};
