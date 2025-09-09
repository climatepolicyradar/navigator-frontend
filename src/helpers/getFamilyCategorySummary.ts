import orderBy from "lodash/orderBy";

import { TDocumentCategory, TFamily, TGeographySummary, TGeographySummaryCategory } from "@/types";

export const categoryMap: Record<TDocumentCategory, { summaryCategory: TGeographySummaryCategory; unit: [string, string] }> = {
  All: null,
  "Climate Finance Projects": {
    summaryCategory: "MCF",
    unit: ["Climate Finance Project", "Climate Finance Projects"],
  },
  Laws: {
    summaryCategory: "Legislative",
    unit: ["Law", "Laws"],
  },
  Litigation: {
    summaryCategory: "Litigation",
    unit: ["Litigation document", "Litigation documents"],
  },
  "Offshore Wind Reports": {
    summaryCategory: "Reports",
    unit: ["Offshore Wind Report", "Offshore Wind Reports"],
  },
  Policies: {
    summaryCategory: "Executive",
    unit: ["Policy", "Policies"],
  },
  "UNFCCC Submissions": {
    summaryCategory: "UNFCCC",
    unit: ["UNFCCC Submission", "UNFCCC Submissions"],
  },
};

export type TCategorySummary = {
  id: string;
  count: number;
  families: TFamily[];
  title: string;
  unit: [string, string];
};

export const getFamilyCategorySummary = (summary: TGeographySummary, category: TDocumentCategory): TCategorySummary => {
  const { summaryCategory, unit } = categoryMap[category] || {};

  // Specific category
  if (summaryCategory) {
    return {
      id: summaryCategory,
      count: summary.family_counts[summaryCategory],
      families: summary.top_families[summaryCategory],
      title: category,
      unit,
    };
  }

  // All
  return {
    id: "all",
    count: Object.values(summary.family_counts).reduce((total, count) => total + count, 0),
    families: orderBy(Object.values(summary.top_families).flat(), ["family_date"], ["desc"]),
    title: category,
    unit: ["document", "documents"],
  };
};
