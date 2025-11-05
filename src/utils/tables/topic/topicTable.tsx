import Link from "next/link";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TTableColumn, TTableRow } from "@/types";
import { joinNodes } from "@/utils/reactNode";
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
            <div className="flex flex-wrap gap-y-2">
              {joinNodes(
                familyTopics.conceptsGrouped[rootConcept.wikibase_id]
                  .sort((a, b) => {
                    const countA = familyTopics.conceptCounts[a.wikibase_id] || 0;
                    const countB = familyTopics.conceptCounts[b.wikibase_id] || 0;
                    return countB - countA;
                  })
                  .map((concept) => (
                    <span className="inline-block" key={concept.wikibase_id}>
                      <ConceptLink
                        concept={concept}
                        label={`${firstCase(concept.preferred_label)} (${familyTopics.conceptCounts[concept.wikibase_id] || 0})`}
                      >
                        <div className="flex flex-col gap-2">
                          <h6 className="font-bold">{firstCase(concept.preferred_label)}</h6>
                          <span className="">{concept.description}</span>
                          <span className="text-xs text-gray-500">
                            This concept is mentioned in the following documents, click on the document to view the specific passages:
                          </span>
                          <ul className="flex flex-col gap-2">
                            {/* because the concepts are stored as "wikibase_id:label" we have this weird lookup */}
                            {familyTopics.documents
                              .filter((doc) =>
                                Object.keys(doc.conceptCounts).some((key) => key === concept.wikibase_id + ":" + concept.preferred_label)
                              )
                              .sort((a, b) => {
                                const countA = a.conceptCounts ? a.conceptCounts[`${concept.wikibase_id}:${concept.preferred_label}`] || 0 : 0;
                                const countB = b.conceptCounts ? b.conceptCounts[`${concept.wikibase_id}:${concept.preferred_label}`] || 0 : 0;
                                return countB - countA;
                              })
                              .map((doc) => {
                                const topicCount = doc.conceptCounts
                                  ? doc.conceptCounts[`${concept.wikibase_id}:${concept.preferred_label}`] || 0
                                  : 0;
                                return (
                                  <li key={doc.importId}>
                                    <Link
                                      className="font-medium hover:text-blue-800 transition underline-offset-2 hover:underline"
                                      href={{
                                        pathname: `/documents/${doc.slug}`,
                                        query: { [QUERY_PARAMS.concept_name]: concept.preferred_label },
                                      }}
                                    >
                                      {doc.title} ({topicCount})
                                    </Link>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </ConceptLink>
                    </span>
                  )),
                <span className="mr-1">,</span>
              )}
            </div>
          ),
          value: "",
        },
      },
    });
  });
  return rows;
};
