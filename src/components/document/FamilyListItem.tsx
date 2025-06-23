import { FC, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TFamily } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { truncateString } from "@/utils/truncateString";

import { FamilyMeta } from "./FamilyMeta";

interface IProps {
  children?: ReactNode;
  family: TFamily;
  showSummary?: boolean;
  titleClasses?: string;
}

export const FamilyListItem: FC<IProps> = ({ children, family, showSummary = true, titleClasses = "hover:underline" }) => {
  const {
    corpus_type_name,
    family_slug,
    family_geographies,
    family_description,
    family_name,
    family_date,
    family_category,
    family_metadata,
    family_source,
  } = family;

  const allTitleClasses = joinTailwindClasses("result-title text-left font-medium text-lg duration-300 flex items-start", titleClasses);

  return (
    <div className="family-list-item relative">
      <div className="flex flex-wrap text-sm gap-1 my-2 items-center middot-between">
        <FamilyMeta
          category={family_category}
          corpus_type_name={corpus_type_name}
          source={family_source}
          date={family_date}
          geographies={family_geographies}
          {...(corpus_type_name === "Reports" ? { author: (family_metadata as { author: string[] }).author } : {})}
        />
      </div>
      <LinkWithQuery href={`/document/${family_slug}`} className={allTitleClasses} passHref data-cy="family-title">
        {family_name}
      </LinkWithQuery>
      {showSummary && (
        <p
          className="my-3 text-content"
          data-cy="family-description"
          dangerouslySetInnerHTML={{
            __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375),
          }}
        />
      )}
      {children}
    </div>
  );
};
