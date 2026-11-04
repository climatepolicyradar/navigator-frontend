import { render, screen } from "@testing-library/react";

import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { TNestedSearchLabel } from "@/types";

const label = (type: string, value: string): TNestedSearchLabel => ({
  id: `${type}::${value}`,
  type,
  value,
  children: [],
});

describe("SearchFilterLevel", () => {
  it("renders entity type and document type labels as one ungrouped list", () => {
    render(
      <SearchFilterLevel
        labels={[label("entity_type", "Nationally Determined Contribution (NDC)"), label("document_type", "Submission to the Global Stocktake")]}
        ancestorPath={[]}
        level={2}
      />
    );

    expect(screen.getByText("Nationally Determined Contribution (NDC)")).toBeInTheDocument();
    expect(screen.getByText("Submission to the Global Stocktake")).toBeInTheDocument();
    expect(screen.queryByText("Entity Type")).not.toBeInTheDocument();
    expect(screen.queryByText("Document Type")).not.toBeInTheDocument();
  });

  it("still groups labels whose types are genuinely different", () => {
    render(<SearchFilterLevel ancestorPath={[]} level={2} labels={[label("author_type", "Party"), label("process", "GST1 Submission")]} />);
    expect(screen.getByText("Author Type")).toBeInTheDocument();
    expect(screen.getByText("Process")).toBeInTheDocument();
  });
});
