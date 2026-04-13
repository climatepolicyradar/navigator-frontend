import { getTaxonomy } from "@/bff/methods/getTaxonomy";
import { TApiDataInCategory, TApiFamilyPublic, TCategory, TCorpusTypeDictionary, TFamilyAttribution, TFamilyPublic } from "@/types";

const CATEGORY_MAP: Record<TCategory, TApiDataInCategory> = {
  Executive: "Policy",
  EXECUTIVE: "Policy",
  Law: "Law",
  Legislative: "Law",
  LEGISLATIVE: "Law",
  Litigation: "Litigation",
  LITIGATION: "Litigation",
  MCF: "Multilateral Climate Fund project",
  Policy: "Policy",
  Reports: "Report",
  REPORTS: "Report",
  UNFCCC: "UN submission",
};

export const transformOldFamily = (oldFamily: TApiFamilyPublic, corpusTypes: TCorpusTypeDictionary): TFamilyPublic => {
  const allCorpora = Object.values(corpusTypes).flatMap((corpusType) => corpusType.corpora);
  const corpus = allCorpora.find((corpus) => corpus.corpus_import_id === oldFamily.corpus_id);

  const attribution: TFamilyAttribution = {
    category: CATEGORY_MAP[oldFamily.category],
    taxonomy: getTaxonomy(oldFamily.category.toLowerCase() as Lowercase<TCategory>, oldFamily.organisation, oldFamily.corpus_id),
    corpusImageAlt: corpus?.title ?? "No corpus image found",
    corpusNote: corpus?.text ?? "No corpus note found",
    provider: oldFamily.corpus?.organisation?.name || oldFamily.organisation,
  };
  if (corpus?.image_url) attribution.corpusImage = corpus.image_url;
  if (oldFamily.corpus?.attribution_url) attribution.url = oldFamily.corpus.attribution_url;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { corpus: _corpus, ...strippedOldFamily } = oldFamily;

  return { ...strippedOldFamily, attribution };
};
