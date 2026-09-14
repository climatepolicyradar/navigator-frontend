import { Earth, ListFilter, LucideInfo } from "lucide-react";

import { EmptyTopicsFilter } from "@/components/atoms/misc/EmptyTopicsFilter";
import { ProductSupport } from "@/components/molecules/productSupport/ProductSupport";
import { TFiltersGroupConfig } from "@/types";
import { prepareGeographyFilters } from "@/utils/filters/prepareGeographyFilter";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

export const SEARCH_FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    title: "Filters",
    subtitle: "Choose themes and specific filters to refine your search",
    Icon: ListFilter,
    container: "drawer",
    rootLabelTypes: ["category"],
  },
  {
    title: "Geography",
    subtitle: "Publish location of main document",
    Icon: Earth,
    container: "drawer",
    rootLabelTypes: ["region"],
    prepareRootLabels: prepareGeographyFilters,
    topLevelDefaultOpen: true,
  },
  {
    title: "Topic",
    container: "popover",
    afterPartition: true,
    rootLabelTypes: ["concept"],
    prepareRootLabels: prepareTopicFilters,
    topLevelDefaultOpen: true,
    header: (
      <div className="pb-2 flex gap-1">
        <LucideInfo size={16} className="pt-0.5 h-full shrink-0 text-text-brand" />
        <p className="text-xs text-text-primary font-normal leading-4">
          Search for documents most relevant to key Topics and see the exact text passages where they are mentioned.{" "}
          <ProductSupport
            content="topics"
            className="inline-block text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
          >
            Learn more
          </ProductSupport>
        </p>
      </div>
    ),
  },
  {
    title: "Date",
    container: "datepicker",
    rootLabelTypes: [],
  },
];

export const PASSAGE_FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    title: "Topic",
    container: "popover",
    rootLabelTypes: ["concept"],
    prepareRootLabels: prepareTopicFilters,
    emptyStateRender: EmptyTopicsFilter,
  },
];
