import Link from "next/link";

import { SearchDocument } from "@/api/search";

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

const displayParentRelationshipContext = (document: SearchDocument) => {
  const entityType = document.labels.find((label) => label.type === "entity_type")?.value.value;
  const parent = document.documents.find((rel) => rel.type === "member_of");
  const parentCategory = parent?.value.labels.find((label) => label.type === "category")?.value.value;

  return (
    <>
      {entityType && <>{entityType} </>}
      {parent &&
        (parentCategory ? (
          <>
            <i>of the</i> {parentCategory}: {parent.value.title}
          </>
        ) : (
          <>
            <i>in</i> {parent.value.title}
          </>
        ))}
    </>
  );
};

export function DocumentSearchResult({ result }: { result: SearchDocument }) {
  return (
    <>
      {/* CORE DETAILS */}
      <h3 className="font-semibold text-lg">
        {linkHref(result) ? (
          <Link href={linkHref(result)!} className="text-inky-blue hover:underline" dangerouslySetInnerHTML={{ __html: result.title }} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: result.title }} />
        )}
      </h3>
      <p className="font-medium text-neutral-600 mb-3">{displayParentRelationshipContext(result)}</p>
      <div className="text-sm font-medium text-inky-black mb-3 flex gap-6">
        {result.labels
          .filter((label) => label.type === "geography")
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .slice(0, 3)
          .map((relationship, i) => (
            <span key={i}>{relationship.value.value}</span>
          ))}
      </div>
    </>
  );
}
