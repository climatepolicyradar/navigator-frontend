import { Fragment, useState } from "react";
import { FamilyMeta } from "./FamilyMeta";
import { TFamilyPage } from "@types";

type TProps = {
  family: TFamilyPage;
  geographyName: string;
  onCollectionClick?: (e: any, i: number) => void;
};

export const FamilyHead = ({ family, onCollectionClick }: TProps) => {
  // don't show more details if there is no extra metadata
  const hasExtraMetadata =
    family.metadata.sector && family.metadata.sector.length > 0 && family.metadata.keyword && family.metadata.keyword.length > 0;
  const [showMoreDetails, setShowMoreDetails] = useState(!hasExtraMetadata);

  const handleMoreDetailsClick = (e: any) => {
    e.preventDefault();
    setShowMoreDetails(true);
  };

  return (
    <div>
      <h1 className="text-4xl">{family.title}</h1>
      {family.collections.length > 0 && (
        <div className="flex text-sm text-indigo-400 mt-4 items-center w-full mb-2">
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
      <div className="flex flex-wrap text-sm gap-1 text-gray-700 mt-2 items-center font-medium" data-cy="family-metadata">
        <FamilyMeta
          category={family.category}
          date={family.published_date}
          geography={family.geography}
          topics={family.metadata.topic}
          author={family.metadata.author_type}
        />
        {!showMoreDetails && (
          <a href="#more-details" className="text-gray-700 ml-2 underline" onClick={handleMoreDetailsClick} data-cy="family-metadata-moreDetails">
            More details
          </a>
        )}
      </div>
      <div data-cy="family-extra-metadata" className="text-sm text-gray-700">
        {showMoreDetails && (
          <>
            {family.metadata.sector && family.metadata.sector.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-600">Sectors:</span> {family.metadata.sector.join(", ")}
              </div>
            )}
            {family.metadata.keyword && family.metadata.keyword.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-600">Keywords:</span> {family.metadata.keyword.join(", ")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
