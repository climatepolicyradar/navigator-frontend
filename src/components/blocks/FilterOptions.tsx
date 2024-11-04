import { useState } from "react";
import { ParsedUrlQuery } from "querystring";

import { InputCheck } from "@components/forms/Checkbox";
import { InputRadio } from "@components/forms/Radio";

import { QUERY_PARAMS } from "@constants/queryParams";

import { TOrganisationDictionary, TThemeConfig, TThemeConfigFilter } from "@types";
import { TextInput } from "@components/forms/TextInput";

const getTaxonomyAllowedValues = (corporaKey: string, taxonomyKey: string, organisations: TOrganisationDictionary) => {
  const allowedValues = organisations[corporaKey].corpora.find((corpus) => corpus.taxonomy.hasOwnProperty(taxonomyKey))?.taxonomy[taxonomyKey]
    ?.allowed_values;

  return allowedValues;
};

type TProps = {
  filter: TThemeConfigFilter;
  query: ParsedUrlQuery;
  handleFilterChange: Function;
  organisations: TOrganisationDictionary;
  themeConfig: TThemeConfig;
};

export const FilterOptions = ({ filter, query, handleFilterChange, organisations, themeConfig }: TProps) => {
  const [search, setSearch] = useState("");

  // If the filter has its own options defined, display them
  if (filter.options && filter.options.length > 0) {
    return (
      <>
        {filter.options.map((option) =>
          filter.type === "radio" ? (
            <InputRadio
              key={option.slug}
              label={option.label}
              checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option.slug)}
              onChange={() => null} // supress normal radio behaviour to allow to deselection
              onClick={() => {
                handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug, true);
              }}
            />
          ) : (
            <InputCheck
              key={option.slug}
              label={option.label}
              checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option.slug)}
              onChange={() => {
                handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug);
              }}
            />
          )
        )}
      </>
    );
  }
  // Check the dependancy filter key for which filters to load the taxonomy for
  let options: string[] = [];
  const dependantFilter = themeConfig.filters.find((f) => f.taxonomyKey === filter.dependantFilterKey);
  const queryDependantFilter = query[QUERY_PARAMS[dependantFilter?.taxonomyKey]] || [];

  // If no filter of a given dependancy is selected, load all dependancy taxonomy values
  if (queryDependantFilter.length === 0) {
    for (let index = 0; index < dependantFilter.options.length; index++) {
      const option = dependantFilter.options[index];
      const taxonomyAllowedValues = getTaxonomyAllowedValues(option.corporaKey, filter.taxonomyKey, organisations);
      options = options.concat(taxonomyAllowedValues);
    }
  } else {
    // Otherwise, load the taxonomy values for the selected dependancy filter(s)
    if (typeof queryDependantFilter === "string") {
      const filterCoporaKey = dependantFilter.options.find((option) => option.slug === queryDependantFilter)?.corporaKey;
      const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCoporaKey, filter.taxonomyKey, organisations);
      options = options.concat(taxonomyAllowedValues);
    } else {
      for (let index = 0; index < queryDependantFilter.length; index++) {
        const filterCoporaKey = dependantFilter.options.find((option) => option.slug === queryDependantFilter[index])?.corporaKey;
        const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCoporaKey, filter.taxonomyKey, organisations);
        options = options.concat(taxonomyAllowedValues);
      }
    }
  }

  // De-duplicate and sort the options
  const optionsDeDuped: string[] = [...new Set(options.sort())].filter((option) => option.toLowerCase().includes(search.toLowerCase()));

  let optionsAsComponents = optionsDeDuped.map((option: string) =>
    filter.type === "radio" ? (
      <InputRadio
        key={option}
        label={option}
        checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option)}
        onChange={() => null} // supress normal radio behaviour to allow to deselection
        onClick={() => {
          handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option, true);
        }}
      />
    ) : (
      <InputCheck
        key={option}
        label={option}
        checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option)}
        onChange={() => {
          handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option);
        }}
      />
    )
  );

  if (filter.quickSearch === "true")
    optionsAsComponents.splice(
      0,
      0,
      <div className="mb-2">
        <TextInput key="search-box" size="small" onChange={(v) => setSearch(v)} value={search} placeholder="Quick search" />
      </div>
    );

  if (optionsAsComponents.length === 1) {
    optionsAsComponents.push(<p>No options matching search</p>);
  }

  return <>{optionsAsComponents.map((o) => o)}</>;
};
