import { render, screen } from "@testing-library/react";

import { FilterOptions } from "@/components/filters/FilterOptions";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TThemeConfig, TThemeConfigFilter } from "@/types";

describe("FilterOptions", () => {
  it("displays the correct filter options when corporaKey is present in themeConfig", () => {
    const testFilter: TThemeConfigFilter = {
      label: "Topic",
      taxonomyKey: "topic",
      apiMetaDataKey: "",
      type: "radio",
      category: [],
      dependentFilterKey: "",
      corporaKey: "Laws and Policies",
    };

    const testThemeConfig: TThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      filters: [testFilter],
      features: {
        familyConceptsSearch: false,
        knowledgeGraph: false,
        litigation: false,
        newPageDesigns: false,
        searchFamilySummary: true,
      },
    };

    const testTaxonomy = {
      "Laws and Policies": {
        taxonomy: {
          topic: {
            allow_any: false,
            allow_blanks: true,
            allowed_values: ["Allowed topic"],
          },
        },
        corpus_type_name: "",
        corpus_type_description: "",
        corpora: [
          {
            title: "",
            description: "",
            corpus_type: "",
            corpus_type_description: "",
            corpus_import_id: "",
            image_url: "",
            text: "",
            total: 0,
            count_by_category: {},
            organisation_id: 1,
            organisation_name: "",
          },
        ],
      },
    };

    render(<FilterOptions filter={testFilter} query={{}} handleFilterChange={() => {}} corpus_types={testTaxonomy} themeConfig={testThemeConfig} />);

    expect(screen.getByText("Allowed topic")).toBeInTheDocument();
  });
});
