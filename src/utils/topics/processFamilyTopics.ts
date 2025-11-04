import { IFamilyDocumentTopics, TSearchResponse } from "@/types";

export const processFamilyTopics = (vespaFamilyData: TSearchResponse): IFamilyDocumentTopics => {
  const documentsWithConceptCounts: IFamilyDocumentTopics = { documents: [], conceptCounts: {} };

  vespaFamilyData.families.forEach((family) => {
    family.hits.forEach((hit) => {
      // Aggregate concept counts across all documents
      Object.entries(hit.concept_counts || {}).forEach(([conceptId, count]) => {
        documentsWithConceptCounts.conceptCounts[conceptId] = (documentsWithConceptCounts.conceptCounts[conceptId] || 0) + count;
      });
      // Store document-level concept counts
      documentsWithConceptCounts.documents.push({
        importId: hit.document_import_id,
        title: hit.document_title,
        slug: hit.document_slug,
        conceptCounts: hit.concept_counts || {},
      });
    });
  });

  return documentsWithConceptCounts;
};
