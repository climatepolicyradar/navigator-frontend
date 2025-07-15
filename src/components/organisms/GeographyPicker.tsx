import { useMemo, useState } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";
import useGeographySubdivisions from "@/hooks/useGeographySubdivisions";
import useSubdivisions from "@/hooks/useSubdivisions";
import { TGeography, TSearchCriteria } from "@/types";

import { InputListContainer } from "../filters/InputListContainer";
import { InputCheck } from "../forms/Checkbox";
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
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [], subdivisions: subdivisionFilters = [] },
  } = searchQuery;

  //   const countryFiltersIsoCodes = countries.filter((country) => countryFilters.includes(country.slug)).map((country) => country.value);

  //   const countrySubdivisionQuery = useGeographySubdivisions(countryFiltersIsoCodes);
  //   const { data: countrySubdivisions = [] } = countrySubdivisionQuery;

  const subdivisionQuery = useSubdivisions();
  const { data: subdivisions = [] } = subdivisionQuery;

  //   const availableSubdivisions = countrySubdivisions && countrySubdivisions.length > 0 ? countrySubdivisions : subdivisions;

  const alphabetisedSubdivisions = subdivisions.sort((s1, s2) => s1.name.localeCompare(s2.name));

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
      <Accordian title={"Subdivision"} className="relative z-10" showFade="true" startOpen>
        <InputListContainer>
          {alphabetisedSubdivisions.map((subdivision) => (
            <InputCheck
              key={subdivision.code}
              label={subdivision.name}
              checked={subdivisionFilters && subdivisionFilters.includes(subdivision.code)}
              onChange={() => {
                handleFilterChange(QUERY_PARAMS["subdivision"], subdivision.code);
              }}
              name={`subdivision-${subdivision.code}`}
            />
          ))}
        </InputListContainer>
      </Accordian>
    </div>
  );
};
