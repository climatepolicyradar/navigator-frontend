import { ORDERED_ROOT_TOPIC_IDS, ROOT_TOPICS } from "@/constants/topics";
import { TApiTopic, TTopic, TTopics } from "@/types";
import { sortRootTopics } from "@/utils/sorting";

const REQUEST_BATCH_SIZE = 10;

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

  const rootTopicResults = await Promise.allSettled(rootTopicPromises);

  // We batch the requests in order to avoid errors result from spamming too many requests at once
  const batchedTopicResults: PromiseSettledResult<TApiTopic>[] = [];
  for (let topicIdsIndex = 0; topicIdsIndex < topicIds.length; topicIdsIndex += REQUEST_BATCH_SIZE) {
    const batch = topicIds.slice(topicIdsIndex, topicIdsIndex + REQUEST_BATCH_SIZE);
    const batchResults = await Promise.allSettled(batch.map((id) => fetchTopic(id)));
    batchedTopicResults.push(...batchResults);
  }

  const topicResults = [...rootTopicResults, ...batchedTopicResults];
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
