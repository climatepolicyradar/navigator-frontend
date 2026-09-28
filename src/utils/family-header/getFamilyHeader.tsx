import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Geographies } from "@/components/molecules/geographies/Geographies";
import { TCategoryDictionaryKey } from "@/constants/text";
import { getSumUSD } from "@/helpers/getSumUSD";
import { IMetadata, TFamilyPublic } from "@/types";
import { scrollToBlock } from "@/utils/blocks/scrollToBlock";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

type TProps = {
  family: TFamilyPublic;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const getFamilyHeader = ({ family, getCategoryText }: TProps): IMetadata[] => {
  const [year] = convertDate(family.published_date);
  const isLitigation = family.attribution.category === "Litigation";
  const isMCF = family.attribution.category === "Multilateral Climate Fund project";

  const geographiesNode = (
    <Geographies geographyLabels={family.geographies} limit={3} limitOnClick={scrollToBlock("metadata")} limitSuffix={["other", "others"]} />
  );

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
