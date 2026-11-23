import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { ITaxonomyParams, loadTaxonomy } from "@/api/taxonomy";
import { useEnvConfig } from "@/context/EnvConfig";
import { TNestedSearchLabel } from "@/types";
import { getSearchLabelValues } from "@/utils/filters/getSearchLabelValues";

const NO_LABELS: TNestedSearchLabel[] = [];

export const useTaxonomy = (params: ITaxonomyParams, { enabled = true }: { enabled?: boolean } = {}) => {
  const { API_URL } = useEnvConfig();

  const { data, isFetched } = useQuery({
    queryKey: ["taxonomy", API_URL, params],
    queryFn: () => loadTaxonomy(API_URL, params),
    refetchOnWindowFocus: false,
    enabled,
  });

  const labelNames = useMemo(() => getSearchLabelValues(data ?? NO_LABELS), [data]);
  return { labels: data ?? NO_LABELS, labelNames, loaded: isFetched };
};
