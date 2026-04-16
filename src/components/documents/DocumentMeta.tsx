import { CountryLinks } from "@/components/CountryLinks";
import { getLanguage } from "@/helpers/getLanguage";
import useConfig from "@/hooks/useConfig";
import { TDocumentPage, TFamilyPublic } from "@/types";
import { convertDate } from "@/utils/timedate";

export const DocumentMeta = ({
  family,
  isMain,
  document,
  document_type,
}: {
  family: TFamilyPublic;
  isMain: boolean;
  document: TDocumentPage;
  document_type: string;
}) => {
  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;
  const [year] = convertDate(family.published_date);

  return (
    <div className="py-4 my-4 md:my-2 md:flex justify-between items-center">
      <div className="flex flex-col text-sm gap-2">
        <div className="flex items-center gap-2 middot-between flex-wrap">
          <CountryLinks geographies={family.geographies} countries={countries} />
          {family.attribution.category === "Report" && year && <span>{year}</span>}
          {!isMain && document.document_role && <span className="capitalize">{document.document_role.toLowerCase()}</span>}
          {family.attribution.category === "Report" && family.metadata.author && family.metadata.author.length > 0 && (
            <span className="capitalize">{family.metadata.author.join(", ")}</span>
          )}
          <span className="capitalize">{family.attribution.taxonomy}</span>
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
