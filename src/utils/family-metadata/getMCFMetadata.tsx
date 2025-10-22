import { Fragment } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { EN_DASH } from "@/constants/chars";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { getSubCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IMetadata, TCorpusTypeSubCategory, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { isSystemGeo } from "@/utils/isSystemGeo";

export function getMCFMetadata(family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] {
  const metadata = [];

  metadata.push({
    label: "Approval FY",
    value: getApprovedYearFromEvents(family.events) || EN_DASH,
  });

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => {
        const geoSlug = getCountrySlug(geo, countries);
        const geoName = getCountryName(geo, countries);
        return (
          <Fragment key={geo}>
            {index > 0 && ", "}
            {!isSystemGeo(geoName) ? (
              <LinkWithQuery href={`/geographies/${geoSlug || geo.toLowerCase()}`} className="underline">
                {geoName}
              </LinkWithQuery>
            ) : (
              <span>{geoName}</span>
            )}
          </Fragment>
        );
      }),
    });
  }

  metadata.push({
    label: "Fund",
    value: getSubCategoryName(family.organisation as TCorpusTypeSubCategory) || EN_DASH,
  });

  family.metadata?.project_value_fund_spend?.length > 0 &&
    family.metadata?.project_value_fund_spend[0] !== "0" &&
    metadata.push({
      label: "Fund Spend",
      value: getSumUSD(family.metadata?.project_value_fund_spend),
    });

  family.metadata?.project_value_co_financing?.length > 0 &&
    family.metadata?.project_value_co_financing[0] !== "0" &&
    metadata.push({
      label: "Co-Financing",
      value: getSumUSD(family.metadata?.project_value_co_financing),
    });

  /* Metadata */
  family.metadata?.status?.length > 0 &&
    metadata.push({
      label: "Status",
      value: family.metadata.status.join(", "),
    });
  family.metadata?.theme?.length &&
    metadata.push({
      label: "Theme",
      value: family.metadata.theme.join(", "),
    });
  family.metadata?.implementing_agency?.length > 0 &&
    metadata.push({
      label: "Implementing Agency",
      value: family.metadata.implementing_agency.join(", "),
    });
  family.metadata?.sector?.length &&
    metadata.push({
      label: "Sector",
      value: family.metadata.sector.join(", "),
    });
  family.metadata?.focal_area?.length > 0 &&
    metadata.push({
      label: "Focal Area",
      value: family.metadata.focal_area.join(", "),
    });
  family.metadata?.result_area?.length > 0 &&
    metadata.push({
      label: "Result Area",
      value: family.metadata.result_area.join(", "),
    });
  family.metadata?.project_url?.length > 0 &&
    family.metadata?.project_url[0] !== "" &&
    metadata.push({
      label: "Source",
      value: (
        <ExternalLink url={family.metadata.project_url[0]} className="underline">
          Visit project page
        </ExternalLink>
      ),
    });

  return metadata;
}
