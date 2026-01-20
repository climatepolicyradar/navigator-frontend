import { TSearchResponse } from "@/types";

export const extractTopicIds = (vespaSearchResponse: TSearchResponse): string[] => {
  const topicIds = new Set<string>();

  (vespaSearchResponse.families ?? []).forEach((family) => {
    family.hits.forEach((hit) => {
      Object.keys(hit.concept_counts ?? {}).forEach((topicKey) => {
        const [topicId] = topicKey.split(":");
        topicIds.add(topicId);
      });
    });
  });

  return Array.from(topicIds);
};
