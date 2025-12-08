import { useMemo } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { ARROW_RIGHT } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TFamilyPublic } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import {
  getTopicDrawerDocumentTableRows,
  TDocumentMentionsTableColumnId,
  TOPIC_DRAWER_DOCUMENTS_TABLE_COLUMNS,
} from "@/utils/tables/topic/topicDrawerDocumentTable";
import { firstCase } from "@/utils/text";

interface IProps {
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics;
  onOpenChange: (open: boolean) => void; // Triggered each time the drawer is opened or closed
  open: boolean; // Whether the drawer is currently open. Necessitates useState
  topicWikibaseId: string | null; // The currently displayed topic
}

export const TopicDrawer = ({ family, familyTopics, onOpenChange, open, topicWikibaseId }: IProps) => {
  const topic = useMemo(
    () =>
      [...Object.values(familyTopics.conceptsGrouped).flat(), ...familyTopics.rootConcepts].find((topic) => topic.wikibase_id === topicWikibaseId),
    [familyTopics, topicWikibaseId]
  );

  // Returns an empty drawer if there is no matching topic (zero state, ensures drawer is always rendered)
  if (!topic) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Topic">
        {null}
      </Drawer>
    );
  }

  const topicName = firstCase(topic.preferred_label);
  const documentRows = getTopicDrawerDocumentTableRows(family, familyTopics, topic);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={topicName}>
      <div className="grid grid-cols-[120px_auto] gap-x-3 gap-y-2 text-sm text-gray-700 leading-5">
        <div className="font-medium">Definition</div>
        <div>
          <p>{firstCase(topic.description)}</p>
          <ul className="flex flex-col gap-1 mt-3">
            <li>
              {ARROW_RIGHT}&ensp;
              <PageLink
                external
                href={getConceptStoreLink(topic.wikibase_id)}
                className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
              >
                View source data and methodology
              </PageLink>
            </li>
            <li>
              {ARROW_RIGHT}&ensp;
              <PageLink
                href="/search"
                query={{ [QUERY_PARAMS.concept_name]: topic.preferred_label }}
                className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
              >
                Search the entire database for ‘{topicName}’
              </PageLink>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="mt-9 mb-5 text-lg text-gray-950 font-heavy leading-6">Documents mentioning this topic</h3>
      <InteractiveTable<TDocumentMentionsTableColumnId>
        columns={TOPIC_DRAWER_DOCUMENTS_TABLE_COLUMNS}
        rows={documentRows}
        defaultSort={{ column: "mentions", order: "desc" }}
      />
      <p className="mt-3 text-sm text-gray-700 italic">
        We automatically identify mentions of key topics in documents, helping you quickly find exactly where they are. Accuracy is not 100%.{" "}
        <PageLink href="/faq" hash="topics-faqs" className="inline-block underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500">
          Learn more
        </PageLink>
      </p>
    </Drawer>
  );
};
