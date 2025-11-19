import orderBy from "lodash/orderBy";
import { Fragment, ReactNode } from "react";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { IFamilyDocumentTopics, IMetadata } from "@/types";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { firstCase } from "@/utils/text";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

const MAX_SHOWN_TOPICS = 3;

export const getTopicsMetadataItem = (familyTopics: IFamilyDocumentTopics): IMetadata | null => {
  if (!familyTopicsHasTopics(familyTopics)) return null;

  const onShowMore = () => {
    const topicsBlock = document.getElementById("section-topics");
    topicsBlock?.scrollIntoView({ behavior: "smooth" });
  };

  // Prepare data needed to populate topics
  const topicsData = Object.values(familyTopics.conceptsGrouped).flat();

  // Get the most referenced topics and how many will be hidden
  const sortedTopicCounts = orderBy(Object.entries(familyTopics.conceptCounts), ["1"], ["desc"]);
  const topics = sortedTopicCounts
    .map(([wikibaseId, topicCount]) => {
      const topic = topicsData.find((concept) => concept.wikibase_id === wikibaseId);
      return topic ? { topic, topicCount } : null;
    })
    .filter((topic) => topic);
  const visibleTopics = topics.slice(0, MAX_SHOWN_TOPICS);
  const hiddenTopicsCount = Math.max(0, topics.length - MAX_SHOWN_TOPICS);

  if (visibleTopics.length === 0) return null;

  const topicsNode: ReactNode[] = joinNodes(
    visibleTopics.map(({ topic, topicCount }) => (
      <ConceptLink
        key={topic.wikibase_id}
        concept={topic}
        label={
          <>
            {firstCase(topic.preferred_label)} <span className="text-gray-500">({topicCount})</span>
          </>
        }
      />
    )),
    ", "
  );

  if (hiddenTopicsCount > 0) {
    topicsNode.push(
      <Fragment key="others">
        &ensp;
        <button role="button" className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500" onClick={onShowMore}>
          +{hiddenTopicsCount} {pluralise(hiddenTopicsCount, ["other", "others"])}
        </button>
      </Fragment>
    );
  }

  return {
    label: "Topics",
    value: topicsNode,
  };
};
