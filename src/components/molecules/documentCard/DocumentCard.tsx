import { SearchDocument } from "@/api/search";
import { formatDate } from "@/utils/timedate";

const MAX_DESCRIPTION_LENGTH = 275;

const getDocumentPublishedYear = (doc: SearchDocument) => {
  return doc.attributes.published_date ? formatDate(doc.attributes.published_date as string)[0] : undefined;
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

  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        e.preventDefault();
        onClick?.(document, e);
      }}
      className="group text-left w-full p-4 py-5 flex gap-8 transition hocus:rounded-md hocus:bg-inky-blue/4 hocus:border-transparent"
      data-ph-capture-attribute-link-purpose={context ?? "document-card"}
      data-ph-capture-attribute-position-page={page}
      data-ph-capture-attribute-position-total={page !== undefined && positionOffset !== undefined ? positionOffset + page : undefined}
    >
      <span className="basis-12.5 grow-0 shrink-0">
        <span>{getDocumentPublishedYear(document)}</span>
      </span>
      <span>
        {/* CORE DETAILS */}
        <h3 className="font-semibold text-base mb-3">
          <span className="text-inky-blue group-hover:underline group-focus:underline" dangerouslySetInnerHTML={{ __html: document.title }} />
        </h3>
        {document.description && (
          <p
            className="text-base text-neutral-600 mb-3"
            dangerouslySetInnerHTML={{
              __html: document.description.slice(0, MAX_DESCRIPTION_LENGTH) + (document.description.length > MAX_DESCRIPTION_LENGTH ? "..." : ""),
            }}
          />
        )}
        <span className="flex gap-4">
          <span>{document.labels.find((label) => label.type === "category")?.value.value}</span>
          {/* DISPLAYING GEOS */}
          <ul className="flex flex-wrap gap-2 text-base text-neutral-600">
            {document.labels
              .filter((label) => label.type === "geography" && label.value.type === "country")
              .map((label) => (
                <li key={label.value.value}>{label.value.value}</li>
              ))}
          </ul>
        </span>
      </span>
    </button>
  );
}
