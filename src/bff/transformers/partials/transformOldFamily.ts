import { TApiFamilyPublic, TCorpusTypeDictionary, TFamilyAttribution, TFamilyPublic } from "@/types";

export const transformOldFamily = (oldFamily: TApiFamilyPublic, corpusTypes: TCorpusTypeDictionary): TFamilyPublic => {
  const allCorpora = Object.values(corpusTypes).flatMap((corpusType) => corpusType.corpora);
  const corpus = allCorpora.find((corpus) => corpus.corpus_import_id === oldFamily.corpus_id);

  const attribution: TFamilyAttribution = {
    corpusImageAlt: corpus?.title ?? "No corpus image found",
    corpusNote: corpus?.text ?? "No corpus note found",
  };
  if (corpus?.image_url) attribution.corpusImage = corpus.image_url;
  if (oldFamily.corpus?.attribution_url) attribution.url = oldFamily.corpus.attribution_url;

  return { ...oldFamily, attribution };
};
