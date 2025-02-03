import useConfig from "@hooks/useConfig";

import { getLanguage } from "@helpers/getLanguage";
import { CountryLinks } from "@components/CountryLinks";
import { TConcept } from "@types";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { convertDate } from "@utils/timedate";
import { ExternalLink } from "@components/ExternalLink";
import Button from "@components/buttons/Button";

export const DocumentMeta = ({
  family,
  isMain,
  document,
  document_type,
  concepts,
  handleConceptClick,
}: {
  family: any;
  isMain: boolean;
  document: any;
  document_type: any;
  concepts?: (TConcept & { count: number })[];
  handleConceptClick?: (label: string) => void;
}) => {
  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;
  const [year] = convertDate(family.published_date);

  return (
    <div className="py-4 my-4 md:my-2 md:flex justify-between items-center">
      <div className="flex flex-col text-sm gap-2">
        <div className="flex items-center gap-2 middot-between flex-wrap">
          <CountryLinks geographies={family.geographies} countries={countries} />
          {family.category === "Reports" && year && <span>{year}</span>}
          {!isMain && document.document_role && <span className="capitalize">{document.document_role.toLowerCase()}</span>}
          {family.category === "Reports" && family.metadata.author && family.metadata.author.length > 0 && (
            <span className="capitalize">{family.metadata.author.join(", ")}</span>
          )}
          {family.category && <span className="capitalize">{family.category}</span>}
          {document_type && (
            <span className="capitalize" data-cy="family-metadata-document_type">
              {document_type}
            </span>
          )}
          {!!document.language && (
            <span>
              {getLanguage(document.language, languages)}
              {!!document.variant && ` (${document.variant})`}
            </span>
          )}
        </div>

        {concepts && concepts.length > 0 && (
          <div className="flex items-center">
            <span className="mr-1">
              <strong>Concepts</strong>
            </span>
            {concepts.map((concept, index) => (
              <span key={concept.wikibase_id} className="flex items-center">
                {handleConceptClick ? (
                  <Button
                    data-cy="view-document-concept"
                    onClick={() => handleConceptClick(concept.preferred_label)}
                    extraClasses="capitalize text-blue-600 hover:underline"
                  >
                    {concept.preferred_label}
                  </Button>
                ) : (
                  <ExternalLink
                    className="capitalize text-blue-600 hover:underline"
                    url={`https://climatepolicyradar.wikibase.cloud/wiki/Item:${concept.wikibase_id}`}
                  >
                    {concept.preferred_label}
                  </ExternalLink>
                )}
                {index < concepts.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
