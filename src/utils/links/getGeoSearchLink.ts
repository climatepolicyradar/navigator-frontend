import { TQueryOverrides } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TFilterPathLabel } from "@/types";
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

export const getGeographyPath = (current: TFilterPathLabel, parent: TFilterPathLabel | null): TFilterPathLabel[] =>
  [current.id, parent?.id].filter(Boolean).map(createLabel);

interface IArgs {
  categoryId: string;
  geographyPath: TFilterPathLabel[];
}

export const getGeoSearchLink = ({ categoryId, geographyPath }: IArgs): { href: string; query: TQueryOverrides } => {
  const checkedLabelPaths: TFilterPathLabel[][] = [geographyPath];

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
