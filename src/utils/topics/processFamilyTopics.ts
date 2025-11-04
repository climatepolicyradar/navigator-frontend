import { IFamilyDocumentTopics, TSearchResponse } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";

export const processFamilyTopics = (vespaFamilyData: TSearchResponse): IFamilyDocumentTopics => {
  const documentsWithConceptCounts: IFamilyDocumentTopics = { documents: [], conceptCounts: {}, rootConcepts: [], conceptsGrouped: {} };

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

  const conceptIds = documentsWithConceptCounts.conceptCounts
    ? Object.keys(documentsWithConceptCounts.conceptCounts).map((id) => id.split(":")[0])
    : [];

  fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
    documentsWithConceptCounts.rootConcepts = rootConcepts;
    documentsWithConceptCounts.conceptsGrouped = groupByRootConcept(concepts, rootConcepts);
  });

  return documentsWithConceptCounts;
};
