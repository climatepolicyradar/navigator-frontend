import { Accordian } from "@/components/accordian/Accordian";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { InputListContainer } from "../filters/InputListContainer";
import { InputCheck } from "../forms/Checkbox";
import { TGeography, TSearchCriteria } from "@/types";
import { useMemo, useState } from "react";
import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";

import { TextInput } from "../forms/TextInput";

interface IProps {
  regions: TGeography[];
  handleRegionChange: (s: string) => void;
  handleFilterChange: (t: string, v: string) => void;
  searchQuery: TSearchCriteria;
  countries: TGeography[];
  regionFilterLabel: string;
  countryFilterLabel: string;
}

export const GeographyPicker = ({
  regions,
  handleRegionChange,
  handleFilterChange,
  searchQuery,
  countries,
  regionFilterLabel,
  countryFilterLabel,
}: IProps) => {
  const [search, setSearch] = useState("");
  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [] },
  } = searchQuery;

  const countriesByRegion = useMemo(() => {
    return regionFilters.length > 0
      ? getCountriesFromRegions({
          regions,
          countries,
          selectedRegions: regionFilters,
        })
      : countries;
  }, [regionFilters, regions, countries]);

  const alphabetisedFilteredCountries = countriesByRegion
    .sort((c1, c2) => c1.display_value.localeCompare(c2.display_value))
    .filter((geo) => geo.display_value.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="text-sm text-text-secondary flex flex-col gap-5">
      <Accordian title={regionFilterLabel} data-cy="regions" startOpen>
        <InputListContainer>
          {regions.map((region) => (
            <InputCheck
              key={region.slug}
              label={region.display_value}
              checked={regionFilters && regionFilters.includes(region.slug)}
              onChange={() => {
                handleRegionChange(region.slug);
              }}
              name={`region-${region.slug}`}
            />
          ))}
        </InputListContainer>
      </Accordian>
      <Accordian title={countryFilterLabel} data-cy="countries" className="relative z-10" showFade="true" startOpen>
        <InputListContainer>
          <div className="mb-2" key="quick-search-box">
            <TextInput size="small" onChange={(v) => setSearch(v)} value={search} placeholder="Quick search" />
          </div>
          {alphabetisedFilteredCountries.map((country) => (
            <InputCheck
              key={country.slug}
              label={country.display_value}
              checked={countryFilters && countryFilters.includes(country.slug)}
              onChange={() => {
                handleFilterChange(QUERY_PARAMS["country"], country.slug);
              }}
              name={`country-${country.slug}`}
            />
          ))}
        </InputListContainer>
      </Accordian>
    </div>
  );
};
