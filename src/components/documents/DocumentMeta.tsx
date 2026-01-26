import { CountryLinks } from "@/components/CountryLinks";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getLanguage } from "@/helpers/getLanguage";
import useConfig from "@/hooks/useConfig";
import { convertDate } from "@/utils/timedate";

export const DocumentMeta = ({ family, isMain, document, document_type }: { family: any; isMain: boolean; document: any; document_type: any }) => {
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
          {family.category && (
            <span className="capitalize">{getCategoryName(family.category, family.corpus_type_name, family.source, family.corpus_id)}</span>
          )}
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
      </div>
    </div>
  );
};
