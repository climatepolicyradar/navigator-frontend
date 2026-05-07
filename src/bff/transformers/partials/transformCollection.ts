import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TDataInDocument, validateCollectionAttributes } from "@/schemas";
import { TCollectionPublicWithFamilies } from "@/types";

export const transformCollection = (document: TDataInDocument, familyDocuments: TDataInDocument[] = []): TCollectionPublicWithFamilies => {
  const collectionAttributes = validateCollectionAttributes(document.attributes);
  const families = familyDocuments.map(transformFamily);

  return {
    description: document.description || families[0]?.summary || "",
    families,
    import_id: document.id,
    slug: collectionAttributes.deprecated_slug,
    title: document.title,
    // Not used:
    metadata: {},
  };
};
