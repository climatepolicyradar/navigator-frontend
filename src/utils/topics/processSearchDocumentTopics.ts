import { ID_SEPARATOR } from "@/constants/chars";
import { IApiFamilyDocumentTopics, ISearchDocument } from "@/types";
import { groupByRootConcept } from "../conceptsGroupedbyRootConcept";
import { fetchAndProcessTopics } from "../fetchAndProcessTopics";

export const processSearchDocumentTopics = async (familyDocument: ISearchDocument): Promise<IApiFamilyDocumentTopics> => {
  const documentsWithConceptCounts: IApiFamilyDocumentTopics = { documents: [], conceptCounts: {}, rootConcepts: [], conceptsGrouped: {} };
  familyDocument.labels
    .filter((labelRel) => labelRel.value.type === "concept")
    .forEach((labelRel) => {
      const wikibaseId = labelRel.value.id.split(ID_SEPARATOR)[1];
      const count = labelRel.count ?? 0;
      documentsWithConceptCounts.conceptCounts[wikibaseId] = (documentsWithConceptCounts.conceptCounts[wikibaseId] || 0) + count;
    });

  familyDocument.documents.forEach(({ value: doc }) => {
    documentsWithConceptCounts.documents.push({
      importId: doc.id,
      title: doc.title,
      slug: String(doc.attributes.deprecated_slug ?? ""),
      conceptCounts: {},
    });
  });

  const conceptIds = Object.keys(documentsWithConceptCounts.conceptCounts);

  const { rootTopics, topics } = await fetchAndProcessTopics(conceptIds);

  documentsWithConceptCounts.rootConcepts = rootTopics;
  documentsWithConceptCounts.conceptsGrouped = groupByRootConcept(topics, rootTopics);

  return documentsWithConceptCounts;
};
