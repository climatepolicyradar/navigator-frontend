import sortBy from "lodash/sortBy";
import { MouseEventHandler, ReactNode } from "react";

import { SearchDocument } from "@/api/search";
import { ID_SEPARATOR } from "@/constants/chars";
import { COUNTRY_FLAGS } from "@/constants/flags";
import { IMetadata } from "@/types";
import { formatDate } from "@/utils/timedate";

const getDocumentGeography = (document: SearchDocument): ReactNode => {
  const allGeographies = document.labels.filter((label) => label.type === "geography");
  const mostSpecificGeoType = ["subdivision", "country", "region"].find((type) => allGeographies.some((geo) => geo.value.type === type));
  const mostSpecificGeographies = sortBy(
    allGeographies.filter((geo) => geo.value.type === mostSpecificGeoType),
    "value.value"
  );
  const geography = mostSpecificGeographies[0];
  const otherGeographies = geography ? mostSpecificGeographies.length - 1 : 0;
  let geographyEmoji = "";
  if (geography) {
    const geoId = geography.value.id.split(ID_SEPARATOR)[1] ?? "";
    if (geoId in COUNTRY_FLAGS) geographyEmoji = COUNTRY_FLAGS[geoId];
  }

  return geography ? (
    <>
      {geographyEmoji && <>{geographyEmoji} </>}
      {geography.value.value}
      {otherGeographies > 0 && <> +{otherGeographies}</>}
    </>
  ) : null;
};

const getDocumentPublishedYear = (doc: SearchDocument): ReactNode => {
  return doc.attributes.published_date ? formatDate(doc.attributes.published_date as string)[0] : undefined;
};

const getDocumentType = (document: SearchDocument): ReactNode => {
  const category = document.labels.filter((label) => label.type === "category")[0];
  return category?.value.value ?? null;
};

type TDocumentAnalytics = {
  context?: string;
  page?: number;
  positionOffset?: number;
};

type TProps = {
  document: SearchDocument;
  onClick?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
  analytics?: TDocumentAnalytics;
};

export function DocumentCard({ document, onClick, analytics }: TProps) {
  const { context, page, positionOffset } = analytics || {};

  const onClickCard: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.currentTarget.blur();
    event.preventDefault();
    onClick?.(document, event);
  };

  const metadata: IMetadata[] = [
    { label: "Geography", value: getDocumentGeography(document) },
    { label: "Year", value: getDocumentPublishedYear(document) },
    { label: "Type", value: getDocumentType(document) },
  ];

  return (
    <button
      type="button"
      onClick={onClickCard}
      data-ph-capture-attribute-link-purpose={context ?? "document-card"}
      data-ph-capture-attribute-position-page={page}
      data-ph-capture-attribute-position-total={page !== undefined && positionOffset !== undefined ? positionOffset + page : undefined}
      className="w-full p-8 flex flex-col gap-6 bg-bg-primary border border-border-normal rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] text-left"
    >
      <h2 className="text-xl text-text-brand font-heavy leading-5" dangerouslySetInnerHTML={{ __html: document.title }} />
      {document.description && (
        <p className="text-base text-text-primary font-normal leading-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: document.description }} />
      )}
      <div className="flex flex-wrap flex-row gap-6">
        {metadata.map(({ label, value }, metadataIndex) => (
          <div key={metadataIndex}>
            <span className="block mb-1 text-sm text-text-secondary leading-5">{label}</span>
            <span className="block text-base text-text-primary font-medium leading-5">{value}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
