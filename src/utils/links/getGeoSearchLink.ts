import { TQueryOverrides } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { GeographyV2, TFeatures, TFilterPathLabel, TSearchLabel, TThemeConfig } from "@/types";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

// Manually map old categories to new label paths as they intentionally don't match up automatically
const CATEGORY_LABEL_PATH_LOOKUP: Record<string, string[]> = {
  "climate-council-reports": ["report_type::Climate council report", "category::Report"],
  "climate-finance-projects": ["category::Multilateral Climate Fund project"],
  "corporate-disclosures": ["category::Corporate Disclosure"],
  laws: ["category::Law"],
  Litigation: ["category::Litigation"],
  "offshore-wind-reports": ["entity_type::Offshore wind report", "report_type::Industry report", "category::Report"],
  policies: ["category::Policy"],
  "UN-submissions": ["category::UN submission"],
};

const createLabel = (id: string): TFilterPathLabel => {
  const [type, value] = id.split(ID_SEPARATOR);
  return { id, type, value };
};

interface IArgs {
  categoryId: string;
  features: TFeatures;
  geography: GeographyV2;
  geographyLabel: TSearchLabel | null;
  themeConfig: TThemeConfig;
}

export const getGeoSearchLink = ({
  categoryId,
  features,
  geography,
  geographyLabel,
  themeConfig,
}: IArgs): { href: string; query: TQueryOverrides } => {
  // Old search

  if (!features["new-search"] || !geographyLabel) {
    const query = { [QUERY_PARAMS.country]: geography.slug };
    if (categoryId !== "All") query[QUERY_PARAMS.category] = categoryId;
    return { href: "/search", query };
  }

  // New search

  const checkedLabelPaths: TFilterPathLabel[][] = [];
  const regionLabel = geographyLabel.labels.find((label) => label.type === "subconcept_of" && label.value.type === "region");
  checkedLabelPaths.push([geographyLabel, regionLabel.value]);

  if (categoryId !== "All") {
    const categoryLabelPath = CATEGORY_LABEL_PATH_LOOKUP[categoryId];
    if (categoryLabelPath) checkedLabelPaths.push(categoryLabelPath.map(createLabel));
  }

  return {
    href: themeConfig.features["new-search"] ? "/search" : "/_search", // Shadow search page if config feature off but feature flag on
    query: {
      [QUERY_PARAMS.filters]: JSON.stringify(filterPathsToQueryGroup(checkedLabelPaths, null, "and")),
    },
  };
};
