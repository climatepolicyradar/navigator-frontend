import { Fragment, useState } from "react";

import { Heading } from "@components/typography/Heading";
import { FamilyMeta } from "./FamilyMeta";

import { TFamilyPage } from "@types";

type TProps = {
  family: TFamilyPage;
  onCollectionClick?: (e: any, i: number) => void;
};

export const FamilyHead = ({ family, onCollectionClick }: TProps) => {
  // don't show 'more details' if there is no extra metadata
  const hasExtraMetadata = family.metadata.keyword && family.metadata.keyword.length > 0;
  const [showMoreDetails, setShowMoreDetails] = useState(!hasExtraMetadata);

  const handleMoreDetailsClick = (e: any) => {
    e.preventDefault();
    setShowMoreDetails(true);
  };

  return (
    <div>
      <Heading level={1}>{family.title}</Heading>
      {family.collections.length > 0 && (
        <div className="md:flex text-sm mt-4 items-center w-full mb-2">
          <span>Part of the&nbsp;</span>
          {family.collections.length > 0 &&
            family.collections.map((collection, i) => (
              <Fragment key={`${collection.title}-${i}`}>
                <a onClick={(e) => onCollectionClick(e, i)} href={`#collection-${i}`}>
                  {collection.title}
                </a>
                {i < family.collections.length - 1 && <span>,&nbsp;</span>}
              </Fragment>
            ))}
        </div>
      )}
      <div className="flex flex-wrap text-sm gap-1 mt-2 items-center middot-between" data-cy="family-metadata">
        <FamilyMeta
          category={family.category}
          corpus_type_name={family.corpus_type_name}
          date={family.published_date}
          geography={family.geographies[0]}
          topics={family.metadata.topic}
          author={family.metadata.author_type}
        />
        {!showMoreDetails && (
          <a href="#more-details" className="underline" onClick={handleMoreDetailsClick} data-cy="family-metadata-moreDetails">
            More details
          </a>
        )}
      </div>
      <div data-cy="family-extra-metadata" className="text-sm">
        {family.metadata.sector && family.metadata.sector.length > 0 && (
          <div className="mt-2">
            <span>Sectors:</span> {family.metadata.sector.join(", ")}
          </div>
        )}
        {showMoreDetails && (
          <>
            {family.metadata.keyword && family.metadata.keyword.length > 0 && (
              <div className="mt-2">
                <span>Keywords:</span> {family.metadata.keyword.join(", ")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
