import { useMemo } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ARROW_RIGHT } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics } from "@/types";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { firstCase } from "@/utils/text";

interface IProps {
  familyTopics: IFamilyDocumentTopics;
  onOpenChange: (open: boolean) => void; // Triggered each time the drawer is opened or closed
  open: boolean; // Whether the drawer is currently open. Necessitates useState
  topicWikibaseId: string | null; // The currently displayed topic
}

export const TopicDrawer = ({ familyTopics, onOpenChange, open, topicWikibaseId }: IProps) => {
  const topic = useMemo(
    () =>
      [...Object.values(familyTopics.conceptsGrouped).flat(), ...familyTopics.rootConcepts].find((topic) => topic.wikibase_id === topicWikibaseId),
    [familyTopics, topicWikibaseId]
  );

  /* Returns an empty drawer if there is no matching topic (zero state, ensures drawer is always rendered) */

  if (!topic) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Topic">
        {null}
      </Drawer>
    );
  }

  const topicName = firstCase(topic.preferred_label);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={topicName}>
      <div className="grid grid-cols-[120px_auto] gap-x-3 gap-y-2 text-sm text-gray-700 leading-5">
        <div className="font-medium">Definition</div>
        <div>
          <p>{topic.description}</p>
          <ul className="flex flex-col gap-1 mt-3">
            <li>
              {ARROW_RIGHT}&ensp;
              <PageLink external href={getConceptStoreLink(topic.wikibase_id)} className="hover:underline">
                View source data and methodology
              </PageLink>
            </li>
            <li>
              {ARROW_RIGHT}&ensp;
              <PageLink href="/search" query={{ [QUERY_PARAMS.concept_name]: topic.preferred_label }} className="hover:underline">
                Search the entire database for ‘{topicName}’
              </PageLink>
            </li>
          </ul>
        </div>
      </div>
    </Drawer>
  );
};
