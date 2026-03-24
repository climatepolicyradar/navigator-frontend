/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState, parseAsString, parseAsJson } from "nuqs";
import { useMemo, useState, useEffect } from "react";

import { ApiClient } from "@/api/http-common";
import { AppliedLabels } from "@/components/_experiment/appliedLabels/AppliedLabels";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { createGroup, isFilterGroupEmpty, QueryBuilder, TQueryGroup, TQueryRule } from "@/components/_experiment/queryBuilder/QueryBuilder";
import { SearchFilters, TFilterCategory } from "@/components/_experiment/searchFilters/SearchFilters";
import { SearchContainer } from "@/components/_experiment/searchResults/SearchResults";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabelResult, loadLabels } from "@/hooks/useLabelSearch";
import { FilterGroupSchema } from "@/schemas";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { addLabelRule, extractLabels, removeLabelRule } from "@/utils/filters/advancedFilters";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features }: TProps) => {
  const [availableFilters, setAvailableFilters] = useState<TLabelResult[]>([]);
  // search query that is typed into the search box
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  // structured filters built in QueryBuilder
  const [filters, setFilters] = useQueryState("filters", parseAsJson<TQueryGroup>(FilterGroupSchema).withDefault(createGroup()));

  // Derive selectedLabels from the filter tree
  const selectedLabels = useMemo(() => extractLabels(filters), [filters]);

  // Control SearchFilters popover from outside
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersOpenFilter, setFiltersOpenFilter] = useState<TFilterCategory | undefined>(undefined);

  const handleSelectLabel = (label: string, type: string) => {
    setFiltersOpenFilter((type as TFilterCategory) || undefined);
    setFiltersOpen(true);
  };

  useEffect(() => {
    loadLabels("").then(setAvailableFilters);
  }, []);

  return (
    <FeaturesContext.Provider value={features}>
      <div className="w-3/4 m-auto mt-8 pb-12 flex flex-col gap-4">
        <IntelliSearch
          selectedLabels={selectedLabels}
          onSelectSuggestion={(suggestion) => {
            if (suggestion) {
              if (suggestion && !selectedLabels.includes(suggestion)) {
                setFilters((prev) => addLabelRule(prev, suggestion));
              }
            }
          }}
          setQuery={setQuery}
        />
        <div className="flex justify-between items-center">
          <SearchFilters
            availableFilters={availableFilters}
            filters={filters}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            openFilter={filtersOpenFilter}
            onChange={(checked, label) => {
              if (checked) {
                setFilters((prev) => addLabelRule(prev, label));
              } else {
                setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()));
              }
            }}
          />
          <QueryBuilder filters={filters} setFilters={setFilters} />
        </div>
        {!isFilterGroupEmpty(filters) && (
          <AppliedLabels
            availableFilters={availableFilters}
            query={query}
            labels={selectedLabels}
            onClear={() => {
              setFilters(createGroup());
              setQuery("");
            }}
            onSelectLabel={handleSelectLabel}
            onRemoveLabel={(label) => setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()))}
            setQuery={setQuery}
          />
        )}
        <SearchContainer
          query={query}
          onSelectLabel={(label) => {
            if (!selectedLabels.includes(label)) {
              setFilters((prev) => addLabelRule(prev, label));
            }
          }}
          filters={filters}
        />
      </div>
    </FeaturesContext.Provider>
  );
};

export default ShadowSearch;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const client = new ApiClient(process.env.CONCEPTS_API_URL);

  return {
    props: withEnvConfig({
      features,
      theme,
      themeConfig,
      posthogPageViewProps: {
        search_version: "v2",
      },
    }),
  };
}) satisfies GetServerSideProps;
