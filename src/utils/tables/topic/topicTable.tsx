import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TTableColumn, TTableRow } from "@/types";
import { joinNodes } from "@/utils/reactNode";
import { firstCase } from "@/utils/text";

export type TTopicTableColumnId = "group" | "topics";

export const topicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2 },
  { id: "topics", name: "Topics", fraction: 5 },
];

type TTopicTableRow = TTableRow<TTopicTableColumnId>;

export const getTopicTableRows = (familyTopics: IFamilyDocumentTopics): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];

  familyTopics.rootConcepts.forEach((rootConcept) => {
    const hasConcepts = familyTopics.conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
    if (!hasConcepts) return null;

    rows.push({
      id: rootConcept.wikibase_id,
      cells: {
        group: {
          label: <ConceptLink concept={rootConcept} />,
          value: rootConcept.preferred_label,
        },
        topics: {
          label: (
            <div className="leading-normal">
              {joinNodes(
                familyTopics.conceptsGrouped[rootConcept.wikibase_id]
                  .sort((a, b) => {
                    const countA = familyTopics.conceptCounts[a.wikibase_id] || 0;
                    const countB = familyTopics.conceptCounts[b.wikibase_id] || 0;
                    return countB - countA;
                  })
                  .map((concept) => (
                    <span className="inline-block" key={concept.wikibase_id}>
                      <ConceptLink concept={concept} label={<span>{firstCase(concept.preferred_label)}</span>}>
                        <>
                          <p className="mb-3 text-gray-700">
                            This topic is mentioned in the following documents. Click on the document to view the specific passages.
                          </p>
                          <ul className="flex flex-col gap-3">
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
                                    <PageLink
                                      className="font-medium underline underline-offset-4 text-brand decoration-gray-300 hover:decoration-gray-500"
                                      href={`/documents/${doc.slug}`}
                                      keepQuery
                                      query={{ [QUERY_PARAMS.concept_name]: concept.preferred_label }}
                                    >
                                      {doc.title}
                                    </PageLink>
                                  </li>
                                );
                              })}
                          </ul>
                        </>
                      </ConceptLink>
                    </span>
                  )),
                ", "
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
