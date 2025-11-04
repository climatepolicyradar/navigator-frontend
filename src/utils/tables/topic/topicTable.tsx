import Link from "next/link";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TTableColumn, TTableRow } from "@/types";
import { firstCase } from "@/utils/text";

export type TTopicTableColumnId = "group" | "concepts";

export const TopicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2 },
  { id: "concepts", name: "Concepts", fraction: 5 },
];

export type TTopicTableRow = TTableRow<TTopicTableColumnId>;

export const getTopicTableRows = (familyTopics: IFamilyDocumentTopics): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];

  familyTopics.rootConcepts.forEach((rootConcept) => {
    const hasConcepts = familyTopics.conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
    if (!hasConcepts) return null;

    rows.push({
      id: rootConcept.wikibase_id,
      cells: {
        group: firstCase(rootConcept.preferred_label),
        concepts: {
          label: (
            <div className="flex flex-wrap gap-y-2 gap-x-1">
              {familyTopics.conceptsGrouped[rootConcept.wikibase_id]
                .sort((a, b) => {
                  const countA = familyTopics.conceptCounts[a.wikibase_id] || 0;
                  const countB = familyTopics.conceptCounts[b.wikibase_id] || 0;
                  return countB - countA;
                })
                .map((concept, i) => (
                  <span className="inline-block" key={concept.wikibase_id}>
                    <ConceptLink
                      concept={concept}
                      label={`${firstCase(concept.preferred_label)} (${familyTopics.conceptCounts[concept.wikibase_id] || 0})`}
                    >
                      <div>
                        <h6 className="mb-2 font-bold">{firstCase(concept.preferred_label)}</h6>
                        <span className="block mb-2">{concept.description}</span>
                        <span className="text-xs text-gray-500">
                          This concept is mentioned in the following documents, click on the document to view the specific passages:
                        </span>
                        <div className="flex flex-col gap-1">
                          {familyTopics.documents
                            .filter((doc) => Object.keys(doc.conceptCounts).some((key) => key.split(":")[0] === concept.wikibase_id)) // TODO: make this nicer
                            .map((doc) => {
                              const topicCount = doc.conceptCounts ? doc.conceptCounts[`${concept.wikibase_id}:${concept.preferred_label}`] || 0 : 0;
                              return (
                                <Link
                                  className="font-medium block hover:text-blue-800 transition underline-offset-2 hover:underline"
                                  key={doc.importId}
                                  href={{
                                    pathname: `/documents/${doc.slug}`,
                                    query: { [QUERY_PARAMS.concept_name]: concept.preferred_label },
                                  }}
                                >
                                  {doc.title} ({topicCount})
                                </Link>
                              );
                            })}
                        </div>
                      </div>
                    </ConceptLink>
                    {i < familyTopics.conceptsGrouped[rootConcept.wikibase_id].length - 1 && ", "}
                  </span>
                ))}
            </div>
          ),
          value: "",
        },
      },
    });
  });
  return rows;
};
