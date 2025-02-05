import { TCorpusTypeDictionary } from "@types";

export const calculateTotalFamilies = (corpus_types: TCorpusTypeDictionary) => {
  const totals = {
    laws: 0,
    policies: 0,
    unfccc: 0,
  };

  if (!corpus_types) return totals;

  Object.values(corpus_types).forEach((corpus_type) => {
    corpus_type.corpora.forEach((corpus) => {
      if (!corpus.count_by_category) return;
      totals.laws += corpus.count_by_category?.Legislative || 0;
      totals.policies += corpus.count_by_category?.Executive || 0;
      totals.unfccc += corpus.count_by_category?.UNFCCC || 0;
    });
  });

  return totals;
};
