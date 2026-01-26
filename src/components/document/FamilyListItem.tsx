import { FC, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TFamily } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { truncateString } from "@/utils/truncateString";
import { transformVespaMetadataToFamilyMetadata } from "@/utils/vespa";

import { FamilyMeta } from "./FamilyMeta";

interface IProps {
  children?: ReactNode;
  family: TFamily;
  showSummary?: boolean;
  titleClasses?: string;
  className?: string;
}

export const FamilyListItem: FC<IProps> = ({ children, family, showSummary = true, titleClasses = "hover:underline", className }) => {
  const {
    corpus_import_id,
    corpus_type_name,
    family_slug,
    family_geographies,
    family_description,
    family_name,
    family_date,
    family_category,
    family_source,
    metadata,
  } = family;

  const allTitleClasses = joinTailwindClasses("result-title text-left font-medium text-lg duration-300 flex items-start", titleClasses);

  const family_metadata = transformVespaMetadataToFamilyMetadata(metadata);

  // If the case is litigation and we have a core object, use that as the summary text
  const summaryText = family_category === "Litigation" ? (family_metadata?.core_object?.[0] ?? family_description) : family_description;

  return (
    <li className={`family-list-item relative flex flex-col gap-2 pb-8 border-border-light ${className}`}>
      <div className="flex flex-wrap text-sm gap-x-4 items-center">
        <FamilyMeta
          category={family_category}
          corpus_id={corpus_import_id}
          corpus_type_name={corpus_type_name}
          source={family_source}
          date={family_date}
          geographies={family_geographies}
          metadata={family_metadata}
          {...(corpus_type_name === "Reports" ? { author: (family_metadata as { author: string[] }).author } : {})}
        />
      </div>
      <LinkWithQuery href={`/document/${family_slug}`} className={allTitleClasses} passHref data-cy="family-title">
        {family_name}
      </LinkWithQuery>
      {showSummary && (
        <p
          className="text-content text-sm"
          data-cy="family-description"
          dangerouslySetInnerHTML={{
            __html: truncateString(summaryText.replace(/(<([^>]+)>)/gi, ""), 375),
          }}
        />
      )}
      {family_metadata?.status?.length > 0 && <p className="text-sm">Status: {family_metadata?.status.join(", ")}</p>}
      {children}
    </li>
  );
};
