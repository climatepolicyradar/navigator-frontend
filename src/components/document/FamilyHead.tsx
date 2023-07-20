import { CountryLink } from "@components/CountryLink";
import { TFamilyPage } from "@types";
import { convertDate } from "@utils/timedate";
import { Fragment } from "react";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { isSystemGeo } from "@utils/isSystemGeo";

type TProps = {
  family: TFamilyPage;
  geographyName: string;
  geographySlug: string;
  onCollectionClick?: (e: any) => void;
};

export const FamilyHead = ({ family, geographyName, geographySlug, onCollectionClick }: TProps) => {
  const [year] = family.published_date ? convertDate(family.published_date) : "";
  const breadcrumbCategory = { label: "Search results", href: "/search" };
  const breadcrumbGeography = { label: geographyName, href: `/geographies/${geographySlug}` };

  return (
    <div className="bg-gray-50 border-b">
      <div className="container">
        <BreadCrumbs geography={breadcrumbGeography} category={breadcrumbCategory} label={family.title} />
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{family.title}</h1>
            {family.collections.length > 0 && (
              <div className="flex text-sm text-indigo-400 mt-4 items-center w-full mb-2">
                <span>Part of the&nbsp;</span>
                {family.collections.length > 0 &&
                  family.collections.map((collection, i) => (
                    <Fragment key={`${collection.title}-${i}`}>
                      <a onClick={onCollectionClick ?? (() => {})} href="#collection">
                        {collection.title}
                      </a>
                      {i < family.collections.length - 1 && <span>,&nbsp;</span>}
                    </Fragment>
                  ))}
              </div>
            )}
            <div className="flex text-sm mt-4 items-center w-full">
              {!isSystemGeo(family.geography) ? (
                <CountryLink countryCode={family.geography}>
                  <span data-analytics-country={geographyName}>{geographyName}</span>
                </CountryLink>
              ) : (
                <span>{family.metadata.author.join(", ")}</span>
              )}
              {year && <span>, {year}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
