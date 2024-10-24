import { FC, ReactNode } from "react";
import { TFamily } from "@types";

import { LinkWithQuery } from "@components/LinkWithQuery";
import { FamilyMeta } from "./FamilyMeta";

import { truncateString } from "@utils/truncateString";

type TProps = {
  family: TFamily;
  children?: ReactNode;
};

export const FamilyListItem: FC<TProps> = ({ family, children }) => {
  const { corpus_type_name, family_slug, family_geographies, family_description, family_name, family_date, family_category } = family;

  return (
    <div className="family-list-item relative">
      <div className="flex flex-wrap text-[13px] gap-1 mb-2 items-center middot-between">
        <FamilyMeta category={family_category} corpus_type_name={corpus_type_name} date={family_date} geographies={family_geographies} />
        {children}
      </div>
      <LinkWithQuery
        href={`/document/${family_slug}`}
        className="result-title text-left text-blue-500 font-medium text-lg transition duration-300 leading-tight hover:underline flex items-start"
        passHref
        data-cy="family-title"
      >
        {family_name}
      </LinkWithQuery>
      <p
        className="mt-2 text-content"
        data-cy="family-description"
        dangerouslySetInnerHTML={{ __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375) }}
      />
    </div>
  );
};
