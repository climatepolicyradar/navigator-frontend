import { LucideEarth, LucideTag } from "lucide-react";

import { SearchDocument } from "@/api/search";
// import { documentRelationshipLabel } from "@/utils/_experiment/documentRelationshipLabel";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";

import { TLabelType } from "../searchFilters/SearchFilters";

const MAX_DESCRIPTION_LENGTH = 275;

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

function iconForLabelType(type: string) {
  switch (type) {
    case "geography":
      return <LucideEarth width={14} height={14} />;
    case "concept":
      return <LucideTag width={14} height={14} />;
  }
}

const FILTER_AGGREGATIONS: TLabelType[] = ["geography", "concept"];
// const RELATIONSHIP_AGGREGATIONS = ["member_of", "has_member"];

export function PrincipalSearchResult({ result }: { result: SearchDocument }) {
  return (
    <>
      <span className="font-medium">{result.labels.find((label) => label.type === "category")?.value.value}</span>
      {/* CORE DETAILS */}
      <h3 className="font-semibold text-lg mb-3">
        {linkHref(result) ? (
          <span className="text-inky-blue group-hover:underline" dangerouslySetInnerHTML={{ __html: result.title }} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: result.title }} />
        )}
      </h3>
      {result.description && (
        <p
          className="text-base text-inky-black mb-3"
          dangerouslySetInnerHTML={{
            __html: result.description.slice(0, MAX_DESCRIPTION_LENGTH) + (result.description.length > MAX_DESCRIPTION_LENGTH ? "..." : ""),
          }}
        />
      )}
      {/* DISPLAYING FILTERS */}
      {FILTER_AGGREGATIONS.map((agg) => {
        const relationshipsOfType = result.labels.filter((label) => label.type === agg);
        if (relationshipsOfType.length === 0) return null;

        return (
          <div key={agg} className="flex items-start gap-6 text-sm text-inky-black mb-3">
            <div className="basis-25 shrink-0 py-0.5 font-semibold">{labelTypeLabel(agg)}</div>
            <ul className="flex flex-wrap gap-1">
              {relationshipsOfType
                .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
                .slice(0, 3)
                .map((relationship, i) => (
                  <li key={i} className="flex gap-1 items-center rounded px-2 py-0.5">
                    {iconForLabelType(relationship.value.type)}
                    <span>{relationship.value.value}</span>
                    {/* <span>{relationship.count !== null && `(${relationship.count})`}</span> */}
                  </li>
                ))}
              {relationshipsOfType.length > 3 && <span className="py-0.5 text-neutral-600">+{relationshipsOfType.length - 3} more</span>}
            </ul>
          </div>
        );
      })}
      {/* DISPLAYING RELATIONSHIPS
       * Removed for now as we semantically should not be nesting anchors/interactivity
       */}
      {/* {RELATIONSHIP_AGGREGATIONS.map((agg) => {
        const relationshipsOfType = result.documents.filter((relationship) => relationship.type === agg);
        if (relationshipsOfType.length === 0) return null;

        return (
          <div key={agg} className="flex items-start gap-6 text-sm text-inky-black mb-3">
            <div className="basis-25 shrink-0 py-0.5 font-semibold">{documentRelationshipLabel(agg)}</div>
            <ul className="flex flex-wrap gap-1">
              {relationshipsOfType.slice(0, 3).map((relationship, i) => (
                <li key={i} className="rounded px-2 py-0.5 flex gap-1 items-start">
                  <LucideFileText width={14} height={14} className="inline mt-0.5 shrink-0" />
                  {linkHref(relationship.value) ? (
                    <Link href={linkHref(relationship.value)!} className="hover:underline">
                      {relationship.value.title}
                    </Link>
                  ) : (
                    <span>{relationship.value.title}</span>
                  )}
                </li>
              ))}
              {relationshipsOfType.length > 3 && <span className="py-0.5 text-neutral-600">+{relationshipsOfType.length - 3} more</span>}
            </ul>
          </div>
        );
      })} */}
    </>
  );
}
