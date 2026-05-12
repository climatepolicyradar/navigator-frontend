import { Fragment } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { EN_DASH } from "@/constants/chars";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IFamilyDocumentTopics, IMetadata, TFamilyPublic } from "@/types";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

export function getMCFMetadata(family: TFamilyPublic, familyTopics: IFamilyDocumentTopics | null): IMetadata[] {
  const metadata = [];

  const approvalYear = getApprovedYearFromEvents(family.events);

  if (approvalYear) {
    metadata.push({
      label: "Approval FY",
      value: approvalYear,
    });
  }

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => {
        return (
          <Fragment key={geo.slug}>
            {index > 0 && ", "}
            {!isSystemGeo(geo.name) ? <GeographyLink {...geo} /> : <span>{geo.name}</span>}
          </Fragment>
        );
      }),
    });
  }

  metadata.push({
    label: "Fund",
    value: family.attribution.taxonomy || EN_DASH,
  });

  if (family.metadata?.project_value_fund_spend && family.metadata?.project_value_fund_spend[0] !== "0") {
    metadata.push({
      label: "Fund Spend",
      value: getSumUSD(family.metadata?.project_value_fund_spend),
    });
  }

  if (family.metadata?.project_value_co_financing && family.metadata?.project_value_co_financing[0] !== "0") {
    metadata.push({
      label: "Co-Financing",
      value: getSumUSD(family.metadata?.project_value_co_financing),
    });
  }

  /* Metadata */
  if (family.metadata?.status?.length) {
    metadata.push({
      label: "Status",
      value: family.metadata.status.join(", "),
    });
  }
  if (family.metadata?.theme?.length) {
    metadata.push({
      label: "Theme",
      value: family.metadata.theme.join(", "),
    });
  }
  if (family.metadata?.implementing_agency?.length) {
    metadata.push({
      label: "Implementing Agency",
      value: family.metadata.implementing_agency.join(", "),
    });
  }
  if (family.metadata?.sector?.length) {
    metadata.push({
      label: "Sector",
      value: family.metadata.sector.join(", "),
    });
  }
  if (family.metadata?.focal_area?.length) {
    metadata.push({
      label: "Focal Area",
      value: family.metadata.focal_area.join(", "),
    });
  }
  if (family.metadata?.result_area?.length) {
    metadata.push({
      label: "Result Area",
      value: family.metadata.result_area.join(", "),
    });
  }

  metadata.push({
    label: "Type",
    value: "Project", // MCF families are always projects
  });

  if (family.metadata?.project_url && family.metadata?.project_url[0] !== "") {
    metadata.push({
      label: "Source",
      value: (
        <ExternalLink url={family.metadata.project_url[0]} className="underline">
          Visit project page
        </ExternalLink>
      ),
    });
  }

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  return metadata;
}
