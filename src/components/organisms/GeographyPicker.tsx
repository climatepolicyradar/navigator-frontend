import { getFilterLabel } from "@/utils/getFilterLabel";
import { Accordian } from "@/components/accordian/Accordian";
import router from "next/router";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { InputListContainer } from "../filters/InputListContainer";
import { InputCheck } from "../forms/Checkbox";
import { TGeography, TSearchCriteria, TThemeConfig } from "@/types";

interface IProps {
  regions: TGeography[];
  handleRegionChange: (s: string) => void;
  handleFilterChange: (t: string, v: string) => void;
  searchQuery: TSearchCriteria;
  countries: TGeography[];
  themeConfig: TThemeConfig;
}

export const GeographyPicker = ({ regions, handleRegionChange, handleFilterChange, searchQuery, countries, themeConfig }: IProps) => {
  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [] },
  } = searchQuery;

  const alphabetisedCountries = countries.sort((c1, c2) => c1.display_value.localeCompare(c2.display_value));

  return (
    <div className="text-sm text-text-secondary flex flex-col gap-5">
      <Accordian title={getFilterLabel("Region", "region", router.query[QUERY_PARAMS.category], themeConfig)} data-cy="regions" startOpen>
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
      <Accordian
        title={getFilterLabel("Published jurisdiction", "country", router.query[QUERY_PARAMS.category], themeConfig)}
        data-cy="countries"
        className="relative z-10"
        showFade="true"
        startOpen
      >
        <InputListContainer>
          {alphabetisedCountries.map((country) => (
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
