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
  const { family_slug, family_geography, family_description, family_name, family_date, family_category } = family;

  return (
    <div className="family-list-item relative">
      <div className="flex flex-wrap text-sm gap-1 mb-2 items-center middot-between">
        <FamilyMeta category={family_category} date={family_date} geography={family_geography} />
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
