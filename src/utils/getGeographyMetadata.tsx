import { ExternalLink } from "@/components/ExternalLink";
import { Popover } from "@/components/atoms/popover/Popover";
import { GeographyV2, IMetadata } from "@/types";

export const getGeographyMetaData = (stats: NonNullable<GeographyV2["statistics"]>): IMetadata[] => {
  const metadata = [];

  if (stats.federal && stats.federal_details) {
    metadata.push({
      label: "Federative",
      value: stats.federal_details,
    });
  }

  if (stats.political_groups) {
    metadata.push({
      label: "Political groups",
      value: stats.political_groups.split(";").join(", "),
    });
  }

  if (stats.climate_risk_index) {
    metadata.push({
      label: "Global climate risk index",
      value: (
        <Popover
          openOnHover
          trigger={
            <button className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 cursor-help!">
              {stats.climate_risk_index}
            </button>
          }
        >
          <div className="flex flex-col gap-4">
            <p>
              The annually published Global Climate Risk Index analyses to what extent countries have been affected by the impacts of weather-related
              loss events (storms, floods, heat waves etc.).
            </p>
            <p>
              This data is from the Global Risk Index 2021 published by{" "}
              <ExternalLink className="underline hover:text-blue-800 transition" url="https:www.germanwatch.org/en/cri">
                German Watch
              </ExternalLink>
              . Numbers marked with an asterisk (*) are from the Global Risk Index 2020, being the latest available data for that country. This data
              was last updated on this site on 18 September 2023.
            </p>
            <p>
              See the full report published by German Watch{" "}
              <ExternalLink className="underline hover:text-blue-800 transition" url="https:www.germanwatch.org/en/19777">
                here
              </ExternalLink>
              .
            </p>
          </div>
        </Popover>
      ),
    });
  }

  if (stats.worldbank_income_group) {
    metadata.push({
      label: "World Bank income group",
      value: stats.worldbank_income_group,
    });
  }

  if (stats.global_emissions_percent) {
    metadata.push({
      label: "Share of global emissions",
      value: (
        <Popover
          openOnHover
          trigger={
            <button className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 cursor-help!">
              {stats.global_emissions_percent + "%"}
            </button>
          }
        >
          <div className="flex flex-col gap-4">
            <p>
              The share of global emissions data is from{" "}
              <ExternalLink className="underline hover:text-blue-800 transition" url="https:www.climatewatchdata.org/">
                Climate Watch
              </ExternalLink>
              , managed by the World Resources Institute.
            </p>
            <p>This percentage is based on emissions data from 2020. This data was last updated on this site on 18 September 2023.</p>
          </div>
        </Popover>
      ),
    });
  }

  return metadata;
};
