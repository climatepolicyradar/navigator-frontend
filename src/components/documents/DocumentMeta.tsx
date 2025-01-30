import useConfig from "@hooks/useConfig";

import { getLanguage } from "@helpers/getLanguage";
import { CountryLinks } from "@components/CountryLinks";
import { TConcept } from "@types";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { getIcon } from "@helpers/getMetadataIcon";

export const DocumentMeta = ({
  family,
  isMain,
  document,
  concepts,
}: {
  family: any;
  isMain: boolean;
  document: any;
  concepts?: (TConcept & { count: number })[];
}) => {
  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;

  return (
    <div className="py-4 my-4 md:my-2 md:flex justify-between items-center">
      <div className="flex text-sm items-center gap-2 middot-between flex-wrap">
        <CountryLinks geographies={family.geographies} countries={countries} />
        {!isMain && <span className="capitalize">{document.document_role.toLowerCase()}</span>}
        {family.category && <span className="capitalize">{family.category}</span>}
        {!!document.language && (
          <span>
            {getLanguage(document.language, languages)}
            {!!document.variant && ` (${document.variant})`}
          </span>
        )}
        {concepts && concepts.length > 0 && (
          <div className="flex items-center">
            <span className="mr-1">
              <strong>Concepts</strong>
            </span>
            {concepts.map((concept, index) => (
              <span key={concept.wikibase_id} className="flex items-center">
                <LinkWithQuery className="capitalize text-blue-600 hover:underline" href={`/concepts/${concept.wikibase_id}`}>
                  {concept.preferred_label}
                </LinkWithQuery>
                {index < concepts.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
