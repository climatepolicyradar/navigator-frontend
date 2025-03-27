import { TFamilyDocument } from "@/types";

export const matchesCount = (documents: TFamilyDocument[]) => {
  let numberOfMatches = 0;
  if (documents.length) {
    for (const doc of documents) {
      if (doc.document_passage_matches.length) {
        numberOfMatches += doc.document_passage_matches.length;
      }
    }
  }
  return numberOfMatches;
};
