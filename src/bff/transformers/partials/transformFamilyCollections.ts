import { TDataInFile } from "@/schemas";
import { TApiCollectionPublic, TCollectionPublic } from "@/types";

export const transformFamilyCollections = (oldCollections: TApiCollectionPublic[], newFiles: TDataInFile[]): TCollectionPublic[] =>
  newFiles
    .filter((file) => file.type === "member_of")
    .map((file) => {
      const oldCollection = oldCollections.find((collection) => file.value.id === collection.import_id);
      if (!oldCollection) throw new Error(`File '${file.value.id}' does not match any V2 API collection`);

      return {
        description: file.value.description || "",
        import_id: file.value.id,
        title: file.value.title,
        // Not used:
        metadata: {},
        // TODO apply transformations to remaining fields
        slug: oldCollection.slug,
      };
    });
