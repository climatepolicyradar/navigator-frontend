import { FC, ReactNode } from "react";
import { TFamily } from "@/types";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { FamilyMeta } from "./FamilyMeta";

import { truncateString } from "@/utils/truncateString";
import { Popover } from "../atoms/popover/Popover";

type TProps = {
  family: TFamily;
  children?: ReactNode;
};

export const FamilyListItem: FC<TProps> = ({ family, children }) => {
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
      <LinkWithQuery
        href={`/document/${family_slug}`}
        className="result-title text-blue-600 text-left font-medium text-xl duration-300 flex items-start hover:underline hover:text-blue-800"
        passHref
        data-cy="family-title"
      >
        {family_name}
      </LinkWithQuery>
      <div className="flex flex-wrap text-sm gap-1 my-3 items-center middot-between">
        <FamilyMeta
          category={family_category}
          corpus_type_name={corpus_type_name}
          source={family_source}
          date={family_date}
          geographies={family_geographies}
          {...(corpus_type_name === "Reports" ? { author: (family_metadata as { author: string[] }).author } : {})}
        />
        <Popover trigger={<p className="underline decoration-dotted decoration-[1.5px] hover:decoration-wavy hover:decoration-1">Net-Zero Target</p>}>
          <p className="font-bold">Description</p>
          <p className="my-2">
            A commitment to balance GHG emissions with removal by a certain point in time, effectively reducing the net emissions to zero.
          </p>
          <p className="underline">Source</p>
        </Popover>
      </div>
      <p
        className="my-3 text-content"
        data-cy="family-description"
        dangerouslySetInnerHTML={{ __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375) }}
      />
      {children}
    </div>
  );
};
