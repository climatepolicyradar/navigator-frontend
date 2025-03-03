import { TDocumentPage, TMatchedFamily, TPassage } from "@types";

export const getMatchedPassagesFromSearch = (families: TMatchedFamily[], document: TDocumentPage): [TPassage[], number] => {
  let passageMatches: TPassage[] = [];
  let totalNoOfMatches = 0;
  families.forEach((family) => {
    family.family_documents.forEach((cacheDoc) => {
      if (document.slug === cacheDoc.document_slug) {
        passageMatches.push(...cacheDoc.document_passage_matches);
        totalNoOfMatches = family.total_passage_hits;
      }
    });
  });
  return [passageMatches, totalNoOfMatches];
};
