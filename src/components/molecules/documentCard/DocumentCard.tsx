import { Card } from "@/components/atoms/card/Card";
import { getDocumentType } from "@/helpers/getDocumentType";
import { getLanguage } from "@/helpers/getLanguage";
import { TDocumentPage, TLanguages } from "@/types";
import { pluralise } from "@/utils/pluralise";
import { firstCase } from "@/utils/text";

interface IProps {
  document: TDocumentPage;
  languages: TLanguages;
  matches?: number;
}

export const DocumentCard = ({ document, languages, matches }: IProps) => {
  const { content_type, document_role, language } = document;

  const isMain = Boolean(document_role?.toLowerCase().includes("main"));

  return (
    <Card className="!p-8 bg-surface-brand-darker/4 rounded-sm">
      <div className="mb-2 flex gap-4 flex-wrap text-sm text-text-tertiary leading-none">
        <span>{language && getLanguage(language, languages)}</span>
        {!isMain && <span>{firstCase(document_role?.toLowerCase())}</span>}
        <span>{getDocumentType(content_type)}</span>
      </div>
      <span className="text-lg text-text-brand-darker font-[660] leading-tight">{document.title}</span>
      {matches && (
        <span className="block mt-4 text-sm text-text-brand leading-none">
          {matches} {pluralise(matches, "match", "matches")}
        </span>
      )}
    </Card>
  );
};
