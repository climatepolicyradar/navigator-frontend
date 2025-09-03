import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getCategoryName } from "@/helpers/getCategoryName";
import { TFamily } from "@/types";
import { formatDate } from "@/utils/timedate";

interface IProps {
  family: TFamily;
}

export const RecentFamilyCard = ({ family }: IProps) => {
  const { family_name, family_slug } = family;

  const categoryName = getCategoryName(family.family_category, family.corpus_type_name, family.family_source);
  const geography = family.family_geographies.join(" / "); // TODO lowest level geography name
  const [year] = formatDate(family.family_date);

  return (
    <LinkWithQuery href={`/documents/${family_slug}`} className="w-51 h-65 shrink-0 border-t-2 border-t-surface-brand-darker">
      <div className="flex flex-col justify-between gap-5 h-full p-5 border border-border-light border-t-0">
        <div className=" text-text-brand-darker font-semibold leading-tight line-clamp-7">{family_name}</div>
        <ul className="flex flex-col gap-1.5 text-[13px] text-text-tertiary leading-none">
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">{categoryName}</li>
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">{geography}</li>
          {!isNaN(year) && <li className="overflow-hidden whitespace-nowrap text-ellipsis">{year}</li>}
        </ul>
      </div>
    </LinkWithQuery>
  );
};
