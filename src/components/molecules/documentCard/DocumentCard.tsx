import { SearchDocument } from "@/api/search";

const MAX_DESCRIPTION_LENGTH = 275;

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

type TProps = {
  document: SearchDocument;
  onClick?: (document: SearchDocument, event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function DocumentCard({ document, onClick }: TProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        onClick(document, e);
      }}
      className="group text-left w-full p-4 py-5 transition hocus:rounded-md hocus:bg-inky-blue/4 hocus:border-transparent"
    >
      <span className="font-medium">{document.labels.find((label) => label.type === "category")?.value.value}</span>
      {/* CORE DETAILS */}
      <h3 className="font-semibold text-lg mb-3">
        {linkHref(document) ? (
          <span className="text-inky-blue group-hover:underline group-focus:underline" dangerouslySetInnerHTML={{ __html: document.title }} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: document.title }} />
        )}
      </h3>
      {document.description && (
        <p
          className="text-base text-neutral-600 mb-3"
          dangerouslySetInnerHTML={{
            __html: document.description.slice(0, MAX_DESCRIPTION_LENGTH) + (document.description.length > MAX_DESCRIPTION_LENGTH ? "..." : ""),
          }}
        />
      )}
      {/* DISPLAYING GEOS */}
      <ul className="flex flex-wrap gap-2 text-base text-neutral-600">
        {document.labels
          .filter((label) => label.type === "geography")
          .map((label, i) => (
            <li key={label.value.value}>
              {label.value.value}
              {i < document.labels.filter((l) => l.type === "geography").length - 1 ? "," : ""}
            </li>
          ))}
      </ul>
    </button>
  );
}
