import { ORDERED_ROOT_TOPIC_IDS, ROOT_TOPICS } from "@/constants/topics";
import { TApiTopic, TTopic, TTopics } from "@/types";
import { sortRootTopics } from "@/utils/sorting";

const fetchTopic = async (topicId: string): Promise<TApiTopic> => {
  return fetch(`https://cdn.climatepolicyradar.org/concepts/${topicId}.json`).then((response) => response.json());
};

export const fetchAndProcessTopics = async (topicIds: string[]): Promise<TTopics> => {
  /* Topic fetching */

  const rootTopicPromises = ORDERED_ROOT_TOPIC_IDS.map(async (topicId) => {
    try {
      return await fetchTopic(topicId);
    } catch {
      const unavailableTopic: TTopic = {
        alternative_labels: [],
        description: "Topic data unavailable",
        has_subconcept: [],
        negative_labels: [],
        preferred_label: ROOT_TOPICS[topicId] || "Other",
        recursive_subconcept_of: [],
        related_concepts: [],
        subconcept_of: [],
        wikibase_id: topicId,
      };
      return unavailableTopic;
    }
  });

  const topicPromises = topicIds.map((topicId) => fetchTopic(topicId));
  const topicResults = await Promise.allSettled([...rootTopicPromises, ...topicPromises]);
  const allTopics = topicResults.filter(Boolean);

  /* Topic processing */

  const rootTopics = sortRootTopics(
    allTopics
      .slice(0, rootTopicPromises.length)
      .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TTopic> => promiseSettledResult.status === "fulfilled")
      .map((promiseSettledResult) => promiseSettledResult.value)
  );

  const topics = allTopics
    .slice(rootTopicPromises.length)
    .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TTopic> => promiseSettledResult.status === "fulfilled")
    .map((promiseSettledResult) => promiseSettledResult.value);

  return { rootTopics, topics };
};
