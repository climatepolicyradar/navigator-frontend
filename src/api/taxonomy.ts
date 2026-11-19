import { ApiClient } from "@/api/http-common";
import { TNestedSearchLabel, TSearchQueryGroup } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

type TTaxonomyResponse = {
  data: TNestedSearchLabel[];
};

export interface ITaxonomyParams {
  patterns: string[];
  filters?: TSearchQueryGroup;
}

export async function loadTaxonomy(apiUrl: string, { patterns, filters }: ITaxonomyParams): Promise<TNestedSearchLabel[]> {
  const client = new ApiClient(apiUrl);
  const searchParams = new URLSearchParams();
  patterns.forEach((pattern) => searchParams.append("include", pattern));
  if (filters) {
    searchParams.set("filters", deflateFilters(filters));
    searchParams.set("encoding", "deflate");
  }
  const response = await client.get<TTaxonomyResponse>(`/search/labels:taxonomy?${searchParams.toString()}`, null);
  return response.data.data || [];
}
