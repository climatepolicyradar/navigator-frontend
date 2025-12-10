import { IFamilyDocumentTopics, TSearchResponse, TTheme } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";

export const processFamilyTopics = async (vespaFamilyData: TSearchResponse, theme: TTheme): Promise<IFamilyDocumentTopics> => {
  const documentsWithConceptCounts: IFamilyDocumentTopics = { documents: [], conceptCounts: {}, rootConcepts: [], conceptsGrouped: {} };

  vespaFamilyData.families.forEach((family) => {
    family.hits.forEach((hit) => {
      // Aggregate concept counts across all documents
      Object.entries(hit.concept_counts || {}).forEach(([conceptId, count]) => {
        const wikiBaseId = conceptId.split(":")[0];
        documentsWithConceptCounts.conceptCounts[wikiBaseId] = (documentsWithConceptCounts.conceptCounts[wikiBaseId] || 0) + count;
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

  const conceptIds = documentsWithConceptCounts.conceptCounts ? Object.keys(documentsWithConceptCounts.conceptCounts) : [];

  const { rootConcepts, concepts } = await fetchAndProcessConcepts(conceptIds, theme);

  documentsWithConceptCounts.rootConcepts = rootConcepts;
  documentsWithConceptCounts.conceptsGrouped = groupByRootConcept(concepts, rootConcepts);

  return documentsWithConceptCounts;
};

export const familyTopicsHasTopics = (familyTopics: IFamilyDocumentTopics | null) =>
  Boolean(familyTopics && Object.keys(familyTopics.conceptCounts).length > 0);
