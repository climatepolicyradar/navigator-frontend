import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Section } from "@/components/molecules/section/Section";
import { TCollectionPublicWithFamilies } from "@/types";
import { pluralise } from "@/utils/pluralise";

interface IProps {
  collections: TCollectionPublicWithFamilies[];
}

export const CollectionsBlock = ({ collections }: IProps) => {
  if (collections.length === 0) return null;

  const title = pluralise(collections.length, ["Part of a collection", `Part of ${collections.length} collections`]);

  return (
    <Section block="collections" title={title}>
      <div className="col-start-1 -col-end-1 flex flex-col gap-4">
        {collections.map((collection) => (
          <div key={collection.import_id}>
            <h3 className="text-gray-950 font-medium">{collection.title}</h3>
            <ul className="list-disc pl-4">
              {collection.families.map((family) => (
                <li key={family.import_id}>
                  <LinkWithQuery
                    href={`/document/${family.slug}`}
                    className="text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                  >
                    {family.title}
                  </LinkWithQuery>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
