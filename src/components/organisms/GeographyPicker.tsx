import { useMemo, useState } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";
import useGeographySubdivisions from "@/hooks/useGeographySubdivisions";
import useSubdivisions from "@/hooks/useSubdivisions";
import { TGeography, TGeographySubdivision, TSearchCriteria, TGeographyWithDocumentCounts } from "@/types";

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
  litigationEnabled: boolean;
}

export const GeographyPicker = ({
  regions,
  handleRegionChange,
  handleFilterChange,
  searchQuery,
  countries,
  regionFilterLabel,
  countryFilterLabel,
  litigationEnabled,
}: IProps) => {
  const [countryQuickSearch, setCountryQuickSearch] = useState("");
  const [subdivisionQuickSearch, setSubdivisionQuickSearch] = useState("");
  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [], subdivisions: subdivisionFilters = [] },
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
    .filter((geo) => geo.display_value.toLowerCase().includes(countryQuickSearch.toLowerCase()));

  const countryFiltersIsoCodes = alphabetisedFilteredCountries
    .filter(
      (country) =>
        (regionFilters.length > 0 && countryFilters.length === 0 && countriesByRegion.includes(country)) || countryFilters.includes(country.slug)
    )
    .map((country) => country.value);

  const { data: countrySubdivisionsData = [] } = useGeographySubdivisions(countryFiltersIsoCodes);

  const subdivisionQuery = useSubdivisions();
  const { data: subdivisionsData = [] } = subdivisionQuery;

  let countrySubdivisions: TGeographySubdivision[] = [];
  let subdivisions: TGeographyWithDocumentCounts[] = [];
  let alphabetisedFilteredSubdivisions: (TGeographySubdivision | TGeographyWithDocumentCounts)[] = [];

  if (litigationEnabled) {
    countrySubdivisions = countrySubdivisionsData;
    subdivisions = subdivisionsData;
    const availableSubdivisions = countrySubdivisions && countrySubdivisions.length > 0 ? countrySubdivisions : subdivisions;
    alphabetisedFilteredSubdivisions = availableSubdivisions
      .sort((s1, s2) => s1.name.localeCompare(s2.name))
      .filter((geo) => geo?.name?.toLowerCase().includes(subdivisionQuickSearch.toLowerCase()));
  }

  return (
    <div className="text-sm text-text-secondary relative flex flex-col gap-5 max-h-full pb-5">
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker">
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
              <TextInput
                size="small"
                onChange={(v) => setCountryQuickSearch(v)}
                value={countryQuickSearch}
                placeholder="Quick search"
                aria-label="Country quick search"
              />
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
        {subdivisions.length > 0 && (
          <Accordian title={"Subdivision"} className="relative z-10" showFade="true" startOpen>
            <InputListContainer>
              <div className="mb-2" key="quick-search-box">
                <TextInput
                  size="small"
                  onChange={(v) => setSubdivisionQuickSearch(v)}
                  value={subdivisionQuickSearch}
                  placeholder="Quick search"
                  aria-label="Subdivision quick search"
                />
              </div>
              {alphabetisedFilteredSubdivisions.map((subdivision) => (
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
        )}
      </div>
    </div>
  );
};
