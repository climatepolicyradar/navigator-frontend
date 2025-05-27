import { TDocumentPage, TMatchedFamily, TPassage } from "@/types";

export const getMatchedPassagesFromSearch = (families: TMatchedFamily[], document: TDocumentPage): [TPassage[], number] => {
  const passageMatches: TPassage[] = [];
  let totalNoOfMatches = 0;
  families.forEach((family) => {
    family.family_documents.forEach((doc) => {
      if (document.slug === doc.document_slug) {
        passageMatches.push(...doc.document_passage_matches);
        totalNoOfMatches = family.total_passage_hits;
      }
    });
  });
  return [passageMatches, totalNoOfMatches];
};
