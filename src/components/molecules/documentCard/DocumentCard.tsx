import { Card } from "@/components/atoms/card/Card";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName } from "@/helpers/getCountryFields";
import { TDocumentPage, TFamilyPage, TGeography } from "@/types";
import { pluralise } from "@/utils/pluralise";
import { convertDate } from "@/utils/timedate";

interface IProps {
  countries: TGeography[];
  document: TDocumentPage;
  family: TFamilyPage;
  matches?: number;
}

export const DocumentCard = ({ countries, document, family, matches }: IProps) => {
  const [year] = convertDate(family.published_date);
  const categoryName = getCategoryName(family.category, family.corpus_type_name, family.organisation);

  return (
    <Card className="!p-8 bg-surface-brand-darker/4 rounded-sm">
      <div className="mb-2 flex gap-4 flex-wrap text-sm text-text-tertiary leading-none">
        {family.geographies.length > 0 && <span>{getCountryName(family.geographies[0], countries)}</span>}
        <span>{year}</span>
        <span>{categoryName}</span>
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
