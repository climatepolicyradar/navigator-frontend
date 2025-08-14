import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TFamily } from "@/types";

interface IProps {
  family: TFamily;
}

/**
 * TODO
 * - Fixed height and width
 * - Maximum number of title lines with ellipsis
 * - Metadata lines no wrap with ellipsis
 */

export const RecentFamilyCard = ({ family }: IProps) => {
  const { family_name, family_slug } = family;

  return (
    <LinkWithQuery href={`/documents/${family_slug}`} className="w-51 h-65 shrink-0 border-t-2 border-t-surface-brand-darker">
      <div className="flex flex-col justify-between gap-5 h-full p-5 border border-border-light border-t-0">
        <div className=" text-text-brand-darker font-semibold leading-tight line-clamp-7">{family_name}</div>
        <ul className="flex flex-col gap-1.5 text-[13px] text-text-tertiary leading-none">
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">LOWEST GEOGRAPHY</li>
          <li className="overflow-hidden whitespace-nowrap text-ellipsis">YEAR</li>
        </ul>
      </div>
    </LinkWithQuery>
  );
};
