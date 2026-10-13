import { ISearchDocumentResponse } from "@/api/search";
import { ID_SEPARATOR } from "@/constants/chars";

export const extractTopicIds = (searchDocumentResponse: ISearchDocumentResponse): string[] => {
  const topicIds = new Set<string>();

  searchDocumentResponse.data.labels
    .filter((labelRel) => labelRel.value.type === "concept")
    .forEach((labelRel) => {
      const [, wikibaseId] = labelRel.value.id.split(ID_SEPARATOR);
      topicIds.add(wikibaseId);
    });

  return Array.from(topicIds);
};
