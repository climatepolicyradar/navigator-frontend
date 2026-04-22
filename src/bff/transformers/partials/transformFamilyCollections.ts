import { TCollectionPublic, TFamilyApiNewData } from "@/types";

export const transformFamilyCollections = (document: TFamilyApiNewData): TCollectionPublic[] => {
  const { description, documents: files } = document;

  return files
    .filter((file) => file.type === "member_of")
    .map((file) => ({
      description: description || file.value.description || "",
      import_id: file.value.id,
      metadata: {}, // Not used
      slug: file.value.attributes.deprecated_slug,
      title: file.value.title,
    }));
};
