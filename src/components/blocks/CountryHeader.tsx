import { TGeographyStats, TGeography } from "@types";
import useConfig from "@hooks/useConfig";
import Tooltip from "@components/tooltip";
import { ExternalLink } from "@components/ExternalLink";

type TProps = {
  country: TGeographyStats;
  targetCount: number;
  onTargetClick: () => void;
};

export const CountryHeader = ({ country, targetCount, onTargetClick }: TProps) => {
  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const countryGeography = countries.find((c: TGeography) => c.display_value === country.name);

  const getCountryRegion = () => {
    if (!countryGeography) return "";
    const region = regions.find((r: TGeography) => r.id === countryGeography.parent_id);
    return region.display_value ?? "";
  };

  const countryRegion = getCountryRegion();
  const { name, political_groups, federal, federal_details, worldbank_income_group, climate_risk_index, global_emissions_percent } = country;

  return (
    <div>
      <h1 className="text-4xl">{name}</h1>
      <div className="flex items-start justify-between overflow-hidden">
        <div className="mt-4 shrink-0 md:basis-4/6">
          <div className="grid grid-cols-5 gap-6 items-center text-indigo-700">
            <div className="col-span-5">
              <div data-cy="region" data-analytics-region={countryRegion}>
                {countryRegion}
              </div>
            </div>
            <div className="col-span-5">
              <div className="font-bold">
                {federal && <>Federative {federal && federal_details && <span className="font-light text-sm">({federal_details})</span>}</>}
              </div>
            </div>
            <div data-cy="political-group" className="col-span-2">
              {political_groups !== "" && (
                <>
                  <div className="text-sm font-bold">Political Groups</div>
                  <div>{political_groups.split(";").join(", ")}</div>
                </>
              )}
            </div>
            <div data-cy="global-climate-risk-index" className="col-span-2">
              {climate_risk_index !== null && (
                <>
                  <div className="text-sm font-bold">Global Climate Risk Index</div>
                  <div className="flex items-center">
                    <div className=" mr-1">{climate_risk_index}</div>{" "}
                    <Tooltip
                      id="country-gcri"
                      tooltip={
                        <>
                          <p className="mb-4">
                            The annually published Global Climate Risk Index analyses to what extent countries have been affected by the impacts of
                            weather-related loss events (storms, floods, heat waves etc.).
                          </p>
                          Published by German Watch{" "}
                          <ExternalLink url="https://www.germanwatch.org/en/cri">https://www.germanwatch.org/en/cri</ExternalLink>
                        </>
                      }
                      icon="i"
                    />
                  </div>
                </>
              )}
            </div>
            <div data-cy="targets" className="col-span-1">
              {targetCount > 0 && (
                <>
                  <div className="text-sm font-bold">Targets</div>
                  <div className="flex items-center">
                    <button onClick={onTargetClick} className="mr-1 underline hover:text-blue-800">
                      {targetCount}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div data-cy="world-bank-income-group" className="col-span-2">
              {worldbank_income_group !== "" && (
                <>
                  <div className="text-sm font-bold">World Bank Income Group</div>
                  <div>{worldbank_income_group}</div>
                </>
              )}
            </div>
            <div data-cy="share-of-global-emissions" className="col-span-2">
              {global_emissions_percent !== null && (
                <>
                  <div className="text-sm font-bold">Share of Global Emissions</div>
                  <div>{global_emissions_percent}%</div>
                </>
              )}
            </div>
            <div></div>
          </div>
        </div>
        {countryGeography?.value && (
          <div className="hidden overflow-hidden mt-4 lg:flex lg:self-center lg:shrink svg-country" data-cy="map">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full max-h-[280px]" src={`/images/countries/${countryGeography?.value}.svg`} alt={`${country.name} map`} />
          </div>
        )}
      </div>
    </div>
  );
};
