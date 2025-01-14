import { render, screen } from "@testing-library/react";
import { FilterOptions } from "./FilterOptions";

describe("FilterOptions", () => {
  it("displays the correct filter options when corporaKey is present in themeConfig", () => {
    const testFilter = {
      label: "Topic",
      taxonomyKey: "topic",
      apiMetaDataKey: "",
      type: "radio",
      category: [],
      dependentFilterKey: "",
      corporaKey: "CPR",
    };

    const testThemeConfig = {
      filters: [testFilter],
      labelVariations: [],
      links: [],
      metadata: [],
      documentCategories: [],
    };

    const testTaxonomy = {
      CPR: {
        total: 0,
        count_by_category: {},
        corpora: [
          {
            title: "",
            description: "",
            corpus_type: "",
            corpus_type_description: "",
            corpus_import_id: "",
            image_url: "",
            text: "",
            taxonomy: {
              topic: {
                allow_any: false,
                allow_blanks: true,
                allowed_values: ["Allowed topic"],
              },
            },
          },
        ],
      },
    };

    render(<FilterOptions filter={testFilter} query={{}} handleFilterChange={() => {}} organisations={testTaxonomy} themeConfig={testThemeConfig} />);

    expect(screen.getByText("Allowed topic")).toBeDefined();
  });
});
