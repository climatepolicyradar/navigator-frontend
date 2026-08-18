import { TSearchResponse, TTopic } from "@/types";

// concept_counts keys are `<wikibase id>:<label>` and the same concept can appear across
// several hits, so counts are summed before ranking. Concepts we have no topic record for
// are dropped, as we would have no label to show.
export const getTopDocumentConcepts = (vespaDocumentData: TSearchResponse, topics: TTopic[], limit?: number): TTopic[] => {
  const totals = new Map<string, number>();
  const topicsById = new Map(topics.map((topic) => [topic.wikibase_id, topic]));

  (vespaDocumentData?.families ?? []).forEach((family) =>
    family.hits.forEach((hit) =>
      Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
        const [conceptId] = conceptKey.split(":");
        if (!topicsById.has(conceptId)) return;
        totals.set(conceptId, (totals.get(conceptId) ?? 0) + count);
      })
    )
  );

  return Array.from(totals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([conceptId, count]) => ({ ...topicsById.get(conceptId), count }));
};
