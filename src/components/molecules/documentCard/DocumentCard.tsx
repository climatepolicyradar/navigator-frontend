import { DocumentLabelRelationship, SearchDocument } from "@/api/search";
import { formatDate } from "@/utils/timedate";

const MAX_DESCRIPTION_LENGTH = 275;
const MAX_COUNTRIES_TO_DISPLAY = 3;

const getDocumentPublishedYear = (doc: SearchDocument) => {
  return doc.attributes.published_date ? formatDate(doc.attributes.published_date as string)[0] : undefined;
};

const getContextualDocumentInfo = (doc: SearchDocument) => {
  const category = doc.labels.find((label) => label.type === "category")?.value.value;
  let contextualInfo: DocumentLabelRelationship[][] = [[], []];
  switch (category) {
    case "Multilateral Climate Fund project":
      contextualInfo = [
        [...doc.labels.filter((label) => label.type === "provider")],
        // TODO: decide on which status to display
        // [...doc.labels.filter((label) => label.type === "activity_status")],
      ];
      break;
    case "Report":
    case "Corporate Disclosure":
      contextualInfo = [[...doc.labels.filter((label) => label.type === "author")]];
      break;
    case "Litigation":
      contextualInfo = [
        [
          doc.attributes["identifier::case_number"]
            ? {
                type: "case_number",
                count: null,
                timestamp: null,
                value: { id: "", type: "string", value: doc.attributes["identifier::case_number"] as string },
              }
            : null,
        ].filter((v): v is NonNullable<typeof v> => !!v),
        [...doc.labels.filter((label) => label.type === "geography" && label.value.type === "subdivision")],
        [...doc.labels.filter((label) => label.type === "activity_status")],
        [...doc.labels.filter((label) => label.type === "legal_concept" && label.value.type === "jurisdiction")],
      ];
      break;
  }
  return contextualInfo;
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

  const numberOfCountries = document.labels.filter((label) => label.type === "geography" && label.value.type === "country").length;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        e.preventDefault();
        onClick?.(document, e);
      }}
      className="group text-left w-full p-4 py-5 flex gap-4 transition hocus:rounded-md hocus:bg-inky-blue/4 hocus:border-transparent"
      data-ph-capture-attribute-link-purpose={context ?? "document-card"}
      data-ph-capture-attribute-position-page={page}
      data-ph-capture-attribute-position-total={page !== undefined && positionOffset !== undefined ? positionOffset + page : undefined}
    >
      <span className="basis-12.5 grow-0 shrink-0">
        <span>{getDocumentPublishedYear(document)}</span>
      </span>
      <span className="grow">
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
          <span className="flex flex-wrap gap-1">
            <ul className="text-base text-neutral-600">
              {document.labels
                .filter((label) => label.type === "geography" && label.value.type === "country")
                .slice(0, MAX_COUNTRIES_TO_DISPLAY)
                .map((label, i) => (
                  <li key={label.value.value} className="inline">
                    {label.value.value}
                    {i < numberOfCountries - 1 ? ", " : ""}
                  </li>
                ))}
            </ul>
            {numberOfCountries > MAX_COUNTRIES_TO_DISPLAY && (
              <span className="text-base text-neutral-600">+{numberOfCountries - MAX_COUNTRIES_TO_DISPLAY} more</span>
            )}
          </span>
        </span>
      </span>
      <span className="basis-40 grow-0 shrink-0 flex flex-col gap-2">
        {getContextualDocumentInfo(document).map((info, index) => (
          <span key={index}>{info.map((v) => v.value.value).join(", ")}</span>
        ))}
      </span>
    </button>
  );
}
