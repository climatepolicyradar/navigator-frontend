import { LucideChevronRight, LucideEarth } from "lucide-react";
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
  let parent = document.documents.find((rel) => rel.type === "member_of");
  // when a principal has a single document the relationship is "is_version_of" instead of "member_of"
  if (!parent) parent = document.documents.find((rel) => rel.type === "is_version_of");
  const parentCategory = parent?.value.labels.find((label) => label.type === "category")?.value.value;

  return (
    <>
      {entityType && <span className="text-inky-black">{entityType} </span>}
      {parent &&
        (parentCategory ? (
          <>
            <LucideChevronRight height={16} width={16} /> <span className="text-inky-black">{parentCategory}</span>{" "}
            <LucideChevronRight height={16} width={16} />{" "}
            <Link href={linkHref(parent.value)!} className="text-inky-black hover:text-inky-blue hover:underline">
              {parent.value.title}
            </Link>
          </>
        ) : (
          <>
            <LucideChevronRight height={16} width={16} />{" "}
            <Link href={linkHref(parent.value)!} className="text-inky-black hover:text-inky-blue hover:underline">
              {parent.value.title}
            </Link>
          </>
        ))}
    </>
  );
};

export function DocumentSearchResult({ result, onSelectLabel }: { result: SearchDocument; onSelectLabel?: (label: string) => void }) {
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
      <p className="font-medium text-neutral-500 mb-3 flex items-center gap-1">{displayParentRelationshipContext(result)}</p>
      <div className="text-sm text-inky-black mb-3 flex gap-6 -ml-2">
        {result.labels
          .filter((label) => label.type === "geography")
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .slice(0, 3)
          .map((relationship, i) => (
            <button
              key={i}
              className="flex gap-1 items-center rounded px-2 py-0.5 cursor-pointer hover:bg-neutral-200"
              onClick={() => onSelectLabel?.(relationship.value.value)}
            >
              <LucideEarth width={14} height={14} />
              <span>{relationship.value.value}</span>
            </button>
          ))}
      </div>
    </>
  );
}
