import { ID_SEPARATOR } from "@/constants/chars";
import { IFamilyDocumentTopics, ISearchDocument, TNestedSearchLabel } from "@/types";

export const processSearchDocumentTopics = (familyDocument: ISearchDocument, topics: TNestedSearchLabel[]): IFamilyDocumentTopics => {
  const documentsWithConceptCounts: IFamilyDocumentTopics = { documents: [], conceptCounts: {}, topics };
  familyDocument.labels
    .filter((labelRel) => labelRel.value.type === "concept")
    .forEach((labelRel) => {
      const wikibaseId = labelRel.value.id.split(ID_SEPARATOR)[1];
      const count = labelRel.count ?? 0;
      documentsWithConceptCounts.conceptCounts[wikibaseId] = (documentsWithConceptCounts.conceptCounts[wikibaseId] || 0) + count;
    });

  familyDocument.documents.forEach(({ value: doc }) => {
    const conceptCounts: Record<string, number> = {};
    familyDocument.labels
      .filter((labelRel) => labelRel.value.type === "concept" && labelRel.document_id === doc.id)
      .forEach((labelRel) => {
        const wikibaseId = labelRel.value.id.split(ID_SEPARATOR)[1];
        const count = labelRel.count ?? 0;
        conceptCounts[wikibaseId] = (conceptCounts[wikibaseId] || 0) + count;
      });

    documentsWithConceptCounts.documents.push({
      importId: doc.id,
      title: doc.title,
      slug: String(doc.attributes.deprecated_slug ?? ""),
      conceptCounts,
    });
  });

  return documentsWithConceptCounts;
};
