import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Section } from "@/components/molecules/section/Section";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { TCollectionPublicWithFamilies, TFamilyPublic } from "@/types";
import { pluralise } from "@/utils/pluralise";

interface IProps {
  family: TFamilyPublic;
  collections: TCollectionPublicWithFamilies[];
}

export const CollectionsBlock = ({ family, collections }: IProps) => {
  if (collections.length === 0) return null;

  const renderCollection = (collection: TCollectionPublicWithFamilies) => {
    const hasOtherDocuments = collection.families.some((collectionFamily) => collectionFamily.import_id !== family.import_id);

    return (
      <div key={collection.import_id}>
        <h3 className="text-base text-text-primary font-medium leading-6">{collection.title}</h3>
        {collection.description && (
          <ViewMore context="family-collection-description" maxHeight={96} containerClasses="my-4">
            <div className="text-content" dangerouslySetInnerHTML={{ __html: collection.description.replace(/\r?\n/g, "<br/>") }} />
          </ViewMore>
        )}
        {hasOtherDocuments && (
          <>
            <h3 className="mt-4 text-base text-text-primary font-medium leading-6">Other documents in this collection:</h3>
            <ul className="list-disc pl-4">
              {collection.families.map((family) => (
                <li key={family.import_id} className="my-2">
                  <PageLink
                    href={`/document/${family.slug}`}
                    className="text-[#374151] underline underline-offset-4 decoration-[#d1d5db] hover:decoration-[#6b7280]"
                  >
                    {family.title}
                  </PageLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  const title = pluralise(collections.length, ["Part of a collection", `Part of ${collections.length} collections`]);

  return (
    <Section block="collections" title={title}>
      <div className="col-start-1 -col-end-1 flex flex-col gap-4">{collections.map(renderCollection)}</div>
    </Section>
  );
};
