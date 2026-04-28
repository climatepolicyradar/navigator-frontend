import { getParentDocuments } from "@/bff/methods/getRelations";
import { validateCollectionAttributes } from "@/schemas";
import { TAttributionCategory, TCollectionPublic, TFamilyApiNewData } from "@/types";

export const transformFamilyCollections = (document: TFamilyApiNewData, category: TAttributionCategory): TCollectionPublic[] =>
  getParentDocuments(document.documents, category).map(({ value: collection }) => {
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
