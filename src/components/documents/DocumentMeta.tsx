import useConfig from "@hooks/useConfig";

import { getLanguage } from "@helpers/getLanguage";
import { CountryLinks } from "@components/CountryLinks";

export const DocumentMeta = ({ family, isMain, document }) => {
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
      </div>
    </div>
  );
};
