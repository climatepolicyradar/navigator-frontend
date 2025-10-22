import sortBy from "lodash/sortBy";
import { Fragment, ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { metadataLabelMappings } from "@/constants/familyMetadataMappings";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { getSubCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IMetadata, TCorpusTypeSubCategory, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { isSystemGeo } from "@/utils/isSystemGeo";

export function getMCFMetadata(family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] {
  const metadata = [];

  metadata.push({
    label: metadataLabelMappings.approval_date.label,
    value: getApprovedYearFromEvents(family.events) || EN_DASH,
  });

  metadata.push({
    label: metadataLabelMappings.organisation.label,
    value: getSubCategoryName(family.organisation as TCorpusTypeSubCategory) || EN_DASH,
  });

  family.metadata?.project_value_fund_spend?.length > 0 &&
    family.metadata?.project_value_fund_spend[0] !== "0" &&
    metadata.push({
      label: metadataLabelMappings.project_value_fund_spend.label,
      value: getSumUSD(family.metadata?.project_value_fund_spend),
    });

  family.metadata?.project_value_co_financing?.length > 0 &&
    family.metadata?.project_value_co_financing[0] !== "0" &&
    metadata.push({
      label: metadataLabelMappings.project_value_co_financing.label,
      value: getSumUSD(family.metadata?.project_value_co_financing),
    });

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: metadataLabelMappings.geographies.label,
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

  /* Metadata */
  family.metadata?.status?.length > 0 &&
    metadata.push({
      label: metadataLabelMappings.status.label,
      value: family.metadata.status.join(", "),
    });
  family.metadata?.theme?.length &&
    metadata.push({
      label: metadataLabelMappings.theme.label,
      value: family.metadata.theme.join(", "),
    });
  family.metadata?.implementing_agency?.length > 0 &&
    metadata.push({
      label: metadataLabelMappings.implementing_agency.label,
      value: family.metadata.implementing_agency.join(", "),
    });
  family.metadata?.sector?.length &&
    metadata.push({
      label: metadataLabelMappings.sector.label,
      value: family.metadata.sector.join(", "),
    });
  family.metadata?.focal_area?.length > 0 &&
    metadata.push({
      label: metadataLabelMappings.focal_area.label,
      value: family.metadata.focal_area.join(", "),
    });
  family.metadata?.result_area?.length > 0 &&
    metadata.push({
      label: metadataLabelMappings.result_area.label,
      value: family.metadata.result_area.join(", "),
    });
  family.metadata?.project_url?.length > 0 &&
    family.metadata?.project_url[0] !== "" &&
    metadata.push({
      label: metadataLabelMappings.project_url.label,
      value: (
        <ExternalLink url={family.metadata.project_url[0]} className="underline">
          Visit project page
        </ExternalLink>
      ),
    });

  return metadata;
}
