import { ExternalLink } from "@/components/ExternalLink";
import Tooltip from "@/components/tooltip";
import { Heading } from "@/components/typography/Heading";
import useConfig from "@/hooks/useConfig";
import { TGeographyStats, TGeography, TTheme } from "@/types";

interface IProps {
  country: TGeographyStats;
  targetCount: number;
  onTargetClick: () => void;
  theme: TTheme;
  totalProjects: number;
}

export const CountryHeader = ({ country, targetCount, onTargetClick, theme, totalProjects }: IProps) => {
  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery; // TODO: Update as part of APP-841

  const countryGeography = countries.find((c: TGeography) => c.display_value === country.name);

  const getCountryRegion = () => {
    if (!countryGeography) return "";
    const region = regions.find((r: TGeography) => r.id === countryGeography.parent_id);
    return region.display_value ?? "";
  };

  const countryRegion = getCountryRegion();
  const { name, political_groups, federal, federal_details, worldbank_income_group, climate_risk_index, global_emissions_percent } = country;

  const renderHeaderContent = () => {
    if (theme === "mcf") {
      return (
        <div data-cy="total-projects" className="col-span-1 md:col-span-2">
          <div className="text-sm font-medium text-textDark">Total Projects</div>
          <div>{totalProjects}</div>
        </div>
      );
    } else {
      return (
        <>
          {federal && (
            <div className="col-span-2 md:col-span-5">
              <div className="font-medium text-textDark">Federative {federal_details && <span className="text-sm">({federal_details})</span>}</div>
            </div>
          )}
          <div data-cy="political-group" className="col-span-1 md:col-span-2">
            {political_groups !== "" && (
              <>
                <div className="text-sm font-medium text-textDark">Political Groups</div>
                <div>{political_groups.split(";").join(", ")}</div>
              </>
            )}
          </div>
          <div data-cy="global-climate-risk-index" className="col-span-1 md:col-span-2">
            {climate_risk_index !== null && (
              <>
                <div className="text-sm font-medium text-textDark">Global Climate Risk Index</div>
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
                        <p className="mb-4">
                          This data is from the Global Risk Index 2021 published by{" "}
                          <ExternalLink url="https://www.germanwatch.org/en/cri">German Watch</ExternalLink>. Numbers marked with an asterisk (*) are
                          from the Global Risk Index 2020, being the latest available data for that country. This data was last updated on this site
                          on 18 September 2023.
                        </p>
                        See the full report published by German Watch <ExternalLink url="https://www.germanwatch.org/en/19777">here</ExternalLink>.
                      </>
                    }
                    icon="i"
                    interactableContent
                  />
                </div>
              </>
            )}
          </div>
          <div data-cy="targets" className="order-last col-span-2 md:col-span-1 md:order-none">
            {targetCount > 0 && (
              <>
                <div className="text-sm font-medium text-textDark">Targets</div>
                <div className="flex items-center">
                  <button onClick={onTargetClick} className="mr-1 underline hover:text-blue-800">
                    {targetCount}
                  </button>
                </div>
              </>
            )}
          </div>
          <div data-cy="world-bank-income-group" className="col-span-1 md:col-span-2">
            {worldbank_income_group !== "" && (
              <>
                <div className="text-sm font-medium text-textDark">World Bank Income Group</div>
                <div>{worldbank_income_group}</div>
              </>
            )}
          </div>
          <div data-cy="share-of-global-emissions" className="col-span-1 md:col-span-2">
            {global_emissions_percent !== null && (
              <>
                <div className="text-sm font-medium text-textDark">Share of Global Emissions</div>
                <div className="flex items-center">
                  <div className=" mr-1">{global_emissions_percent}%</div>{" "}
                  <Tooltip
                    id="country-gep"
                    tooltip={
                      <>
                        <p className="mb-4">
                          The share of global emissions data is from{" "}
                          <ExternalLink url="https://www.climatewatchdata.org/">Climate Watch</ExternalLink>, managed by the World Resources
                          Institute.
                        </p>
                        <p className="mb-4">
                          This percentage is based on emissions data from 2020. This data was last updated on this site on 18 September 2023.
                        </p>
                      </>
                    }
                    icon="i"
                    interactableContent
                  />
                </div>
              </>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <Heading level={1}>{name}</Heading>
      <div className="flex items-start justify-between overflow-hidden">
        <div className="mt-4 md:shrink-0 md:basis-4/6">
          <div className="grid grid-cols-2 gap-6 items-center md:grid-cols-5">
            <div className="col-span-2 md:col-span-5">
              <div data-cy="region" data-analytics-region={countryRegion}>
                {countryRegion}
              </div>
            </div>
            {renderHeaderContent()}
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
