import { ParsedUrlQuery } from "querystring";

import get from "lodash/get";
import groupBy from "lodash/groupBy";
import { Fragment, useContext, useState } from "react";

import { InputCheck } from "@/components/forms/Checkbox";
import { InputRadio } from "@/components/forms/Radio";
import { TextInput } from "@/components/forms/TextInput";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { FeatureFlagsContext } from "@/context/FeatureFlagsContext";
import { TCorpusTypeDictionary, TThemeConfig, TThemeConfigFilter, TThemeConfigOption } from "@/types";

const getTaxonomyAllowedValues = (corporaKey: string, taxonomyKey: string, corpus_types: TCorpusTypeDictionary) => {
  const allowedValues = get(corpus_types[corporaKey].taxonomy, taxonomyKey)?.allowed_values || [];

  return allowedValues;
};

interface IProps {
  filter: TThemeConfigFilter;
  query: ParsedUrlQuery;
  handleFilterChange: Function;
  corpus_types: TCorpusTypeDictionary;
  themeConfig: TThemeConfig;
}

const filterIsSelected = (queryValue: string | string[] | undefined, option: string) => {
  if (!queryValue) {
    return false;
  }
  if (typeof queryValue === "string") {
    return queryValue === option;
  } else {
    return queryValue.includes(option);
  }
};

export const FilterOptions = ({ filter, query, handleFilterChange, corpus_types, themeConfig }: IProps) => {
  const [search, setSearch] = useState("");
  const featureFlags = useContext(FeatureFlagsContext);

  // If the filter has its own options defined, display them
  if (filter.options && filter.options.length > 0) {
    const filtersAreGrouped = filter.options.every((option) => option.group);
    const groupedOptions: TThemeConfigOption<any>[][] = []; // any because we don't need to care about value type here

    if (filtersAreGrouped) {
      // Build a 2D array of grouped options
      const optionsByGroup = groupBy(filter.options, "group");
      const groupValues = Array.from(new Set(filter.options.map((option) => option.group))); // Preserve the declared group order from themeConfig

      groupValues.forEach((groupValue) => {
        groupedOptions.push(optionsByGroup[groupValue]);
      });
    } else {
      // Treat all options as a single unlabelled group
      groupedOptions.push(filter.options);
    }

    return (
      <>
        {groupedOptions.map((filterGroup) => {
          return (
            <Fragment key={filterGroup[0].group || "ungrouped"}>
              {groupedOptions.length > 1 && (
                <span className="not-first:mt-3 text-xs text-gray-500 leading-none font-heavy cursor-default">{filterGroup[0].group}</span>
              )}
              {filterGroup.map((option) =>
                filter.type === "radio" ? (
                  <InputRadio
                    key={option.slug}
                    label={option.label}
                    checked={query && filterIsSelected(query[QUERY_PARAMS[filter.taxonomyKey]], option.slug)}
                    onChange={() => null} // suppress normal radio behaviour to allow to deselection
                    onClick={() => {
                      handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug, true);
                    }}
                    name={`${filter.taxonomyKey}=${option.slug}`}
                  />
                ) : (
                  <InputCheck
                    key={option.slug}
                    label={option.label}
                    checked={query && filterIsSelected(query[QUERY_PARAMS[filter.taxonomyKey]], option.slug)}
                    onChange={() => {
                      handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug);
                    }}
                    name={`${filter.taxonomyKey}=${option.slug}`}
                    additionalInfo={option.additionalInfo}
                    learnMoreUrl={option.learnMoreUrl}
                    learnMoreExternal={option.learnMoreExternal === "true"}
                  />
                )
              )}
            </Fragment>
          );
        })}
      </>
    );
  }

  let options: string[] = [];
  // If a filter does not have preset options defined, we need to load the taxonomy values from our config
  // The taxonomy options are nested under a corpora in our config
  // The filter will be chcecked for either have a corporaKey or a dependentFilterKey, which will contain the corporaKey
  if (filter.corporaKey) {
    // Load filter options based on corporaKey, if provided
    options = getTaxonomyAllowedValues(filter.corporaKey, filter.taxonomyKey, corpus_types);
  } else if (filter.dependentFilterKey) {
    // Check whether the filter has a dependanct filter, if it does load the taxonomy values for the dependent filter
    const dependentFilter = themeConfig.filters.find((f) => f.taxonomyKey === filter.dependentFilterKey);
    const queryDependentFilter = query[QUERY_PARAMS[dependentFilter?.taxonomyKey]] || [];
    // If no filter of a given dependency is selected, load all dependency taxonomy values
    if (queryDependentFilter.length === 0) {
      for (let index = 0; index < dependentFilter.options.length; index++) {
        const option = dependentFilter.options[index];
        const taxonomyAllowedValues = getTaxonomyAllowedValues(option.corporaKey, filter.taxonomyKey, corpus_types);
        options = options.concat(taxonomyAllowedValues);
      }
    } else {
      // Otherwise, load the taxonomy values for the selected dependency filter(s)
      if (typeof queryDependentFilter === "string") {
        const filterCorporaKey = dependentFilter.options.find((option) => option.slug === queryDependentFilter)?.corporaKey;
        const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCorporaKey, filter.taxonomyKey, corpus_types);
        options = options.concat(taxonomyAllowedValues);
      } else {
        for (let index = 0; index < queryDependentFilter.length; index++) {
          const filterCorporaKey = dependentFilter.options.find((option) => option.slug === queryDependentFilter[index])?.corporaKey;
          const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCorporaKey, filter.taxonomyKey, corpus_types);
          options = options.concat(taxonomyAllowedValues);
        }
      }
    }
  }

  // De-duplicate and sort the options
  const optionsDeDuped: string[] = options
    ? [...new Set(options.sort())].filter((option) => option.toLowerCase().includes(search.toLowerCase()))
    : [];

  const optionsAsComponents = optionsDeDuped.map((option: string) =>
    filter.type === "radio" ? (
      <InputRadio
        key={option}
        label={option}
        checked={query && filterIsSelected(query[QUERY_PARAMS[filter.taxonomyKey]], option)}
        onChange={() => null} // suppress normal radio behaviour to allow to deselection
        onClick={() => {
          handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option, true);
        }}
        name={`${filter.taxonomyKey}=${option}`}
      />
    ) : (
      <InputCheck
        key={option}
        label={option}
        checked={query && filterIsSelected(query[QUERY_PARAMS[filter.taxonomyKey]], option)}
        onChange={() => {
          handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option);
        }}
        name={`${filter.taxonomyKey}=${option}`}
      />
    )
  );

  if (filter.quickSearch === "true")
    optionsAsComponents.splice(
      0,
      0,
      <div className="mb-2" key="quick-search-box">
        <TextInput size="small" onChange={(v) => setSearch(v)} value={search} placeholder="Quick search" />
      </div>
    );

  if (optionsAsComponents.length === 1) {
    optionsAsComponents.push(<p>No options matching search</p>);
  }

  return <>{optionsAsComponents.map((o) => o)}</>;
};
