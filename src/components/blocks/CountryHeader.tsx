import { TGeographyStats, TGeography } from "@types";
import useConfig from "@hooks/useConfig";
import Tooltip from "@components/tooltip";
import { ExternalLink } from "@components/ExternalLink";

type TProps = {
  country: TGeographyStats;
};

export const CountryHeader = ({ country }: TProps) => {
  const configQuery: any = useConfig("config");
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const countryGeography = countries.find((c: TGeography) => c.display_value === country.name);

  const getCountryRegion = () => {
    if (!countryGeography) return "";
    const region = regions.find((r: TGeography) => r.id === countryGeography.parent_id);
    return region.display_value ?? "";
  };

  const { name, political_groups, federal, federal_details, worldbank_income_group, climate_risk_index, global_emissions_percent } = country;

  return (
    <div className="bg-offwhite border-solid border-lineBorder border-b py-6">
      <div className="container flex items-end justify-between overflow-hidden">
        <div className="md:max-w-lg lg:max-w-5xl md:flex-shrink-0">
          <h1 className="mb-6">{name}</h1>
          <div className="grid grid-cols-2 gap-6 items-center text-indigo-700">
            <div className="font-semibold  text-xl" data-cy="region">{getCountryRegion()}</div>
            <div className="font-semibold text-xl">
              {federal && <>Federative {federal && federal_details && <span className="font-light text-lg">({federal_details})</span>}</>}
            </div>
            {political_groups !== "" && (
              <div data-cy="political-group">
                <div className="text-lg">Political Groups</div>
                <div className="font-semibold text-xl">{political_groups.split(";").join(", ")}</div>
              </div>
            )}
            {worldbank_income_group !== "" && (
              <div data-cy="world-bank-income-group">
                <div className="text-lg">World Bank Income Group</div>
                <div className="font-semibold text-xl">{worldbank_income_group}</div>
              </div>
            )}
            {climate_risk_index !== null && (
              <div data-cy="global-climate-risk-index">
                <div className="text-lg">Global Climate Risk Index</div>
                <div className="font-semibold text-xl flex">
                  <div className="mr-1">{climate_risk_index}</div>{" "}
                  <Tooltip
                    id="country-gcri"
                    tooltip={
                      <>
                        <p className="mb-4">
                          The annually published Global Climate Risk Index analyses to what extent countries have been affected by the impacts of
                          weather-related loss events (storms, floods, heat waves etc.).
                        </p>
                        Published by German Watch{" "}
                        <ExternalLink url="https://www.germanwatch.org/en/cri" className="underline">
                          https://www.germanwatch.org/en/cri
                        </ExternalLink>
                      </>
                    }
                    icon="i"
                  />
                </div>
              </div>
            )}
            {global_emissions_percent !== null && (
              <div data-cy="share-of-global-emissions">
                <div className="text-lg">Share of Global Emissions</div>
                <div className="font-semibold text-xl">{global_emissions_percent}%</div>
              </div>
            )}
          </div>
        </div>
        {countryGeography?.value && (
          <div className="hidden place-items-center lg:flex overflow-hidden svg-country" data-cy="map">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full max-h-[280px]" src={`/images/countries/${countryGeography?.value}.svg`} alt={`${country.name} map`} />
          </div>
        )}
      </div>
    </div>
  );
};
