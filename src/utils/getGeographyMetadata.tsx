import { ExternalLink } from "@/components/ExternalLink";
import { Tooltip } from "@/components/atoms/tooltip/Tooltip";
import { IMetadata, TGeographyStats } from "@/types";

export const getGeographyMetaData = (stats: TGeographyStats): IMetadata[] => {
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
        <Tooltip
          arrow
          content={
            <>
              <p className="mb-4">
                The annually published Global Climate Risk Index analyses to what extent countries have been affected by the impacts of
                weather-related loss events (storms, floods, heat waves etc.).
              </p>
              <p className="mb-4">
                This data is from the Global Risk Index 2021 published by{" "}
                <ExternalLink className="underline" url="https://www.germanwatch.org/en/cri">
                  German Watch
                </ExternalLink>
                . Numbers marked with an asterisk (*) are from the Global Risk Index 2020, being the latest available data for that country. This data
                was last updated on this site on 18 September 2023.
              </p>
              See the full report published by German Watch{" "}
              <ExternalLink className="underline" url="https://www.germanwatch.org/en/19777">
                here
              </ExternalLink>
              .
            </>
          }
          popupClasses="w-[350px] px-3 py-3 !text-sm text-wrap leading-normal font-normal"
          side="bottom"
        >
          <span className="inline underline underline-offset-2 decoration-dotted cursor-help">{stats.climate_risk_index}</span>
        </Tooltip>
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
        <Tooltip
          arrow
          content={
            <>
              <p className="mb-4">
                The share of global emissions data is from{" "}
                <ExternalLink className="underline" url="https://www.climatewatchdata.org/">
                  Climate Watch
                </ExternalLink>
                , managed by the World Resources Institute.
              </p>
              <p className="mb-4">
                This percentage is based on emissions data from 2020. This data was last updated on this site on 18 September 2023.
              </p>
            </>
          }
          popupClasses="w-[350px] px-3 py-3 !text-sm text-wrap leading-normal font-normal"
          side="bottom"
        >
          <span className="inline underline underline-offset-2 decoration-dotted cursor-help">{stats.global_emissions_percent + "%"}</span>
        </Tooltip>
      ),
    });
  }

  return metadata;
};
