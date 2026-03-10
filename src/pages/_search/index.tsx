/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { AppliedLabels } from "@/components/_experiment/appliedLabels/AppliedLabels";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { createGroup, QueryBuilder, TQueryGroup, TQueryRule } from "@/components/_experiment/queryBuilder/QueryBuilder";
import { SearchContainer } from "@/components/_experiment/searchResults/SearchResults";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

/** Extract all label values from "contains" rules in the filter tree. */
function extractLabels(group: TQueryGroup | null): string[] {
  if (!group) return [];
  const labels: string[] = [];
  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.op === "contains" && filter.value) labels.push(filter.value);
    } else {
      labels.push(...extractLabels(filter));
    }
  }
  return labels;
}

const groupIsEmpty = (group: TQueryGroup | null): boolean => {
  if (!group) return true;
  return group.filters.length === 0 || group.filters.every((f) => "field" in f && f.op === "contains" && !f.value);
};

/** Add a label as a new "contains" rule to the root filter group. */
function addLabelRule(group: TQueryGroup | null, label: string): TQueryGroup {
  const rule: TQueryRule = { field: "labels.value.id", op: "contains", value: label };
  if (groupIsEmpty(group)) return { op: "and", filters: [rule] };
  return { ...group, filters: [...group.filters, rule] };
}

/** Remove the first "contains" rule matching a label value from the filter tree. */
function removeLabelRule(group: TQueryGroup, label: string): TQueryGroup | null {
  const newFilters: (TQueryGroup | TQueryRule)[] = [];
  let removed = false;

  for (const filter of group.filters) {
    if (!removed && "field" in filter && filter.op === "contains" && filter.value === label) {
      removed = true; // skip this rule
      continue;
    }
    if (!("field" in filter)) {
      const updated = removeLabelRule(filter, label);
      if (updated) newFilters.push(updated);
      else removed = true; // nested group became empty
    } else {
      newFilters.push(filter);
    }
  }

  if (newFilters.length === 0) return createGroup();
  return { ...group, filters: newFilters };
}

const ShadowSearch = ({ theme, themeConfig, features }: TProps) => {
  // search query that is typed into the search box
  const [query, setQuery] = useState("");
  // structured filters built in QueryBuilder
  const [filters, setFilters] = useState<TQueryGroup>(createGroup());

  // Derive selectedLabels from the filter tree
  const selectedLabels = useMemo(() => extractLabels(filters), [filters]);

  return (
    <FeaturesContext.Provider value={features}>
      <div className="w-3/4 m-auto mt-8">
        <IntelliSearch
          topics={[]}
          selectedLabels={selectedLabels}
          onSelectConcept={(concept) => {
            if (concept) {
              if (concept && !selectedLabels.includes(concept)) {
                setFilters((prev) => addLabelRule(prev, concept));
              }
            }
          }}
          setQuery={setQuery}
        />
      </div>
      <div className="w-3/4 m-auto mt-4 mb-8">
        <div className="mb-4">
          <AppliedLabels
            query={query}
            labels={selectedLabels}
            onSelectLabel={(label) => setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()))}
            setQuery={setQuery}
          />
        </div>
        <QueryBuilder filters={filters} setFilters={setFilters} />
        <pre className="text-xs">{filters ? JSON.stringify(filters, null, 2) : "No filters"}</pre>
      </div>
      <SearchContainer
        query={query}
        onSelectLabel={(label) => {
          if (!selectedLabels.includes(label)) {
            setFilters((prev) => addLabelRule(prev, label));
          }
        }}
        filters={filters}
      />
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
