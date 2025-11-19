import { Fragment } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { EN_DASH } from "@/constants/chars";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { getSubCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IFamilyDocumentTopics, IMetadata, TCorpusTypeSubCategory, TFamilyPublic, TGeography } from "@/types";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

export function getMCFMetadata(family: TFamilyPublic, familyTopics: IFamilyDocumentTopics | null, countries: TGeography[]): IMetadata[] {
  const metadata = [];

  const approvalYear = getApprovedYearFromEvents(family.events);

  approvalYear &&
    metadata.push({
      label: "Approval FY",
      value: approvalYear,
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
            {!isSystemGeo(geoName) ? <GeographyLink code={geo} name={geoName} slug={geoSlug || geo.toLowerCase()} /> : <span>{geoName}</span>}
          </Fragment>
        );
      }),
    });
  }

  metadata.push({
    label: "Fund",
    value: getSubCategoryName(family.organisation as TCorpusTypeSubCategory) || EN_DASH,
  });

  family.metadata?.project_value_fund_spend &&
    family.metadata?.project_value_fund_spend[0] !== "0" &&
    metadata.push({
      label: "Fund Spend",
      value: getSumUSD(family.metadata?.project_value_fund_spend),
    });

  family.metadata?.project_value_co_financing &&
    family.metadata?.project_value_co_financing[0] !== "0" &&
    metadata.push({
      label: "Co-Financing",
      value: getSumUSD(family.metadata?.project_value_co_financing),
    });

  /* Metadata */
  family.metadata?.status &&
    metadata.push({
      label: "Status",
      value: family.metadata.status.join(", "),
    });
  family.metadata?.theme?.length &&
    metadata.push({
      label: "Theme",
      value: family.metadata.theme.join(", "),
    });
  family.metadata?.implementing_agency &&
    metadata.push({
      label: "Implementing Agency",
      value: family.metadata.implementing_agency.join(", "),
    });
  family.metadata?.sector &&
    metadata.push({
      label: "Sector",
      value: family.metadata.sector.join(", "),
    });
  family.metadata?.focal_area &&
    metadata.push({
      label: "Focal Area",
      value: family.metadata.focal_area.join(", "),
    });
  family.metadata?.result_area &&
    metadata.push({
      label: "Result Area",
      value: family.metadata.result_area.join(", "),
    });

  metadata.push({
    label: "Type",
    value: "Project", // MCF families are always projects
  });

  family.metadata?.project_url &&
    family.metadata?.project_url[0] !== "" &&
    metadata.push({
      label: "Source",
      value: (
        <ExternalLink url={family.metadata.project_url[0]} className="underline">
          Visit project page
        </ExternalLink>
      ),
    });

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  return metadata;
}
