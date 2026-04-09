import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TApiCollectionPublicWithFamilies, TCollectionPublicWithFamilies, TCorpusTypeDictionary } from "@/types";

export const transformOldCollections = (
  collections: TApiCollectionPublicWithFamilies[],
  corpusTypes: TCorpusTypeDictionary
): TCollectionPublicWithFamilies[] =>
  collections.map((collection) => ({
    ...collection,
    families: collection.families.map((family) => transformOldFamily(family, corpusTypes)),
  }));
