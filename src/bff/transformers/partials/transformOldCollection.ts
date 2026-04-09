import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TApiCollectionPublicWithFamilies, TCollectionPublicWithFamilies, TCorpusTypeDictionary } from "@/types";

export const transformOldCollection = (
  collection: TApiCollectionPublicWithFamilies,
  corpusTypes: TCorpusTypeDictionary
): TCollectionPublicWithFamilies => ({
  ...collection,
  families: collection.families.map((family) => transformOldFamily(family, corpusTypes)),
});
