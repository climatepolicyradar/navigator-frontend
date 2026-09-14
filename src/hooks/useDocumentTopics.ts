import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchSearchDocuments } from "@/api/search";
import { ID_SEPARATOR } from "@/constants/chars";
import { TTopic } from "@/types";

type TUseDocumentTopicsOptions = {
  enabled?: boolean;
};

/**
 * Fetches the given documents from `search-api` and returns the concepts attached to them as topics.
 *
 * `search-api` concepts are in the format `concept::Q123`. The search UI keys them on the bare `id`.
 */
export const useDocumentTopics = (documentIds: string[], { enabled = true }: TUseDocumentTopicsOptions = {}): TTopic[] => {
  const { data } = useQuery({
    queryKey: ["document-topics", documentIds],
    queryFn: ({ signal }) =>
      fetchSearchDocuments({
        filters: { op: "and", filters: [{ op: "or", filters: documentIds.map((id) => ({ field: "id", op: "contains", value: id })) }] },
        page_size: String(documentIds.length),
        signal,
      }),
    enabled: enabled && documentIds.length > 0,
  });

  return useMemo(() => {
    const topics = new Map<string, TTopic>();

    (data?.results ?? [])
      .flatMap((doc) => doc.labels.filter((label) => label.value.type === "concept"))
      .forEach((label) => {
        const wikibaseId = label.value.id.split(ID_SEPARATOR)[1];

        // A document's labels only have the rudimentary data.
        // The downstream Component only needs the basic values so this is OK.
        topics.set(wikibaseId, {
          wikibase_id: wikibaseId,
          preferred_label: label.value.value,
          count: 0,
          alternative_labels: [],
          description: "",
          has_subconcept: [],
          negative_labels: [],
          recursive_subconcept_of: [],
          related_concepts: [],
          subconcept_of: [],
        });
      });

    return [...topics.values()];
  }, [data]);
};
