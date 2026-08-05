import { Fragment, ReactNode } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { TCategoryDictionaryKey } from "@/constants/text";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IMetadata, TFamilyPublic } from "@/types";
import { scrollToBlock } from "@/utils/blocks/scrollToBlock";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { pluralise } from "@/utils/pluralise";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

const MAX_SHOWN_GEOGRAPHIES = 3;

type TProps = {
  family: TFamilyPublic;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const getFamilyHeader = ({ family, getCategoryText }: TProps): IMetadata[] => {
  const [year] = convertDate(family.published_date);
  const isLitigation = family.attribution.category === "Litigation";
  const isMCF = family.attribution.category === "Multilateral Climate Fund project";
  const { geographies } = family;

  const visibleGeographiesData = geographies.slice(0, MAX_SHOWN_GEOGRAPHIES);
  const hiddenGeographiesCount = Math.max(0, geographies.length - MAX_SHOWN_GEOGRAPHIES);

  const isGeographiesParentAndChild =
    visibleGeographiesData.length === 2 && !visibleGeographiesData[0].code.includes("-") && visibleGeographiesData[1].code.includes("-");

  const geographiesNode: ReactNode[] = joinNodes(
    visibleGeographiesData.map(({ code, name, slug }) => {
      return <GeographyLink key={code} code={code} name={name} slug={isSystemGeo(name) ? null : slug} />;
    }),
    isGeographiesParentAndChild ? <span className="text-gray-400"> / </span> : <>&ensp;</>
  );

  if (hiddenGeographiesCount > 0) {
    geographiesNode.push(
      <Fragment key="others">
        &ensp;
        <button
          role="button"
          className="underline underline-offset-4 decoration-[#d1d5db] hover:decoration-[#6b7280]"
          onClick={scrollToBlock("metadata")}
        >
          +{hiddenGeographiesCount} {pluralise(hiddenGeographiesCount, ["other", "others"])}
        </button>
      </Fragment>
    );
  }

  const pageHeaderMetadata: IMetadata[] = [
    {
      label: "Geography",
      value: geographiesNode,
    },
    { label: `${getCategoryText("familyDate")}`, value: isNaN(year) ? "" : year },
    {
      label: getCategoryText("familyType"),
      value: family.attribution.taxonomy,
    },
  ];

  if (family.collections.length) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: isLitigation
        ? joinNodes(
            family.collections.map((collection) => (
              <PageLink key={collection.import_id} keepQuery href={`/collections/${collection.slug}`} className="hover:underline">
                {collection.title}
              </PageLink>
            )),
            ", "
          )
        : joinNodes(
            family.collections.map((collection) => (
              <button
                key={collection.import_id}
                role="button"
                className="underline underline-offset-4 decoration-[#d1d5db] hover:decoration-[#6b7280]"
                onClick={scrollToBlock("collections")}
              >
                {collection.title}
              </button>
            )),
            ", "
          ),
    });
  }

  if (isMCF) {
    if (family.metadata?.project_value_fund_spend && family.metadata.project_value_fund_spend[0] !== "0") {
      pageHeaderMetadata.push({
        label: "Fund Spend",
        value: getSumUSD(family.metadata.project_value_fund_spend),
      });
    }
    if (family.metadata?.project_value_co_financing && family.metadata.project_value_co_financing[0] !== "0") {
      pageHeaderMetadata.push({
        label: "Co-Financing",
        value: getSumUSD(family.metadata.project_value_co_financing),
      });
    }
  }

  return pageHeaderMetadata;
};
