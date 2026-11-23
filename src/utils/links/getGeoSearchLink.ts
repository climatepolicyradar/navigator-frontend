import { TQueryOverrides } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TFilterPathLabel, TSearchLabel } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

// Manually map old categories to new label paths as they intentionally don't match up automatically
export const CATEGORY_LABEL_PATH_LOOKUP: Record<string, string[]> = {
  "climate-council-reports": ["report_type::Climate council report", "category::Report"],
  "climate-finance-projects": ["category::Multilateral Climate Fund project"],
  "corporate-disclosures": ["category::Corporate Disclosure"],
  laws: ["category::Law"],
  Litigation: ["category::Litigation"],
  "offshore-wind-reports": ["entity_type::Offshore wind report", "report_type::Industry report", "category::Report"],
  policies: ["category::Policy"],
  "UN-submissions": ["category::UN submission"],
};

export const createLabel = (id: string): TFilterPathLabel => {
  const [type, value] = id.split(ID_SEPARATOR);
  return { id, type, value };
};

interface IArgs {
  categoryId: string;
  geographyLabel: TSearchLabel;
}

export const getGeoSearchLink = ({ categoryId, geographyLabel }: IArgs): { href: string; query: TQueryOverrides } => {
  const checkedLabelPaths: TFilterPathLabel[][] = [];
  const parentType = geographyLabel.type === "subdivision" ? "country" : "region";
  const parentLabel = geographyLabel.labels.find((label) => label.type === "subconcept_of" && label.value.type === parentType);
  checkedLabelPaths.push(parentLabel ? [geographyLabel, parentLabel.value] : [geographyLabel]);

  if (categoryId !== "All") {
    const categoryLabelPath = CATEGORY_LABEL_PATH_LOOKUP[categoryId];
    if (categoryLabelPath) checkedLabelPaths.push(categoryLabelPath.map(createLabel));
  }

  return {
    href: "/search",
    query: {
      [QUERY_PARAMS.filters]: deflateFilters(filterPathsToQueryGroup(checkedLabelPaths, null, "and")),
      [QUERY_PARAMS.sort]: "recent",
    },
  };
};
