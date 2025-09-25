import { Fragment, useState } from "react";

import { Heading } from "@/components/typography/Heading";
import { TFamilyPublic } from "@/types";

import { MetadataRenderer } from "./renderers/MetadataRenderer";

interface IProps {
  family: TFamilyPublic;
  onCollectionClick?: (e: any, i: number) => void;
}

export const FamilyHead = ({ family, onCollectionClick }: IProps) => {
  // don't show 'more details' if there is no extra metadata
  const hasExtraMetadata = family.metadata?.keyword && family.metadata?.keyword.length > 0;
  const [showMoreDetails, setShowMoreDetails] = useState(!hasExtraMetadata);

  const showSectorContent = family.category !== "MCF" && family.metadata?.sector?.length > 0;

  const handleMoreDetailsClick = (e: any) => {
    e.preventDefault();
    setShowMoreDetails(true);
  };

  return (
    <div>
      <Heading level={1}>{family.title}</Heading>
      {family.collections?.length > 0 && (
        <div className="text-sm mt-4 items-top w-full mb-2">
          <span>Part of the&nbsp;</span>
          {family.collections?.length > 0 &&
            family.collections?.map((collection, i) => (
              <Fragment key={`${collection.title}-${i}`}>
                <a onClick={(e) => onCollectionClick(e, i)} href={`#collection-${i}`} className="underline text-text-primary hover:text-text-brand">
                  {collection.title}
                </a>
                {i < family.collections.length - 1 && <span>,&nbsp;</span>}
              </Fragment>
            ))}
        </div>
      )}
      <div className="flex flex-wrap text-sm gap-1 mt-2 items-center middot-between" data-cy="family-metadata">
        <MetadataRenderer family={family} />

        {!showMoreDetails && (
          <a href="#more-details" className="underline" onClick={handleMoreDetailsClick} data-cy="family-metadata-moreDetails">
            More details
          </a>
        )}
      </div>
      <div data-cy="family-extra-metadata" className="text-sm">
        {showSectorContent && (
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
