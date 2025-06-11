import { FC, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TFamily } from "@/types";
import { truncateString } from "@/utils/truncateString";

import { FamilyMeta } from "./FamilyMeta";

interface IProps {
  children?: ReactNode;
  family: TFamily;
  showSummary?: boolean;
}

export const FamilyListItem: FC<IProps> = ({ children, family, showSummary = true }) => {
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
      <LinkWithQuery
        href={`/document/${family_slug}`}
        className="result-title text-[#0041A3] text-left font-medium text-lg duration-300 flex items-start !no-underline hover:!underline"
        passHref
        data-cy="family-title"
      >
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
