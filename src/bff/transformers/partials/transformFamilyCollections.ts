import { getParentDocuments } from "@/bff/methods/getRelations";
import { validateCollectionAttributes } from "@/schemas";
import { TCollectionPublic, TFamilyApiNewData } from "@/types";

export const transformFamilyCollections = (document: TFamilyApiNewData): TCollectionPublic[] =>
  getParentDocuments(document.documents).map(({ value: collection }) => {
    const collectionAttributes = validateCollectionAttributes(collection.attributes);

    // TODO add transformCollection, handle description from family
    return {
      description: document.description || collection.description || "",
      import_id: collection.id,
      metadata: {}, // Not used
      slug: collectionAttributes.deprecated_slug,
      title: collection.title,
    };
  });
