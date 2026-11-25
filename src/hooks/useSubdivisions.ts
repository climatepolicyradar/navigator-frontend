import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { configureDocumentsFilters, PRINCIPAL_DOCUMENTS_FILTER } from "@/api/search";
import { loadTaxonomy } from "@/api/taxonomy";
import { ID_SEPARATOR } from "@/constants/chars";
import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { useEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TGeographyWithDocumentCounts, TNestedSearchLabel } from "@/types";

// The taxonomy identifies geographies by a prefixed label id, e.g. "subdivision::MX-TAB",
// whereas consumers of this hook work in bare ISO-3166-2 codes.
const toSubdivisionsWithCounts = (labels: TNestedSearchLabel[]): TGeographyWithDocumentCounts[] =>
  labels.flatMap((label) => {
    const nested = toSubdivisionsWithCounts(label.children);
    if (label.type !== "subdivision" || !label.count) return nested;

    return [{ code: label.id.split(ID_SEPARATOR)[1], name: label.value, type: label.type, count: label.count }, ...nested];
  });

export default function useSubdivisions() {
  const { API_URL } = useEnvConfig();
  const features = useContext(FeaturesContext);
  const params = {
    patterns: [SUBDIVISION_LABEL_PATTERN],
    filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, undefined, features),
  };

  return useQuery({
    // Same key shape as `useTaxonomy`, so this shares a cache entry with any other reader of the same labels.
    queryKey: ["taxonomy", API_URL, params],
    queryFn: () => loadTaxonomy(API_URL, params),
    select: toSubdivisionsWithCounts,
    // Subdivision pages and links are off without the feature, so there is nothing to show.
    enabled: features.subdivisions,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
