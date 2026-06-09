import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { createGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { TLabelResult } from "@/hooks/useLabelSearch";
import { addLabelRule } from "@/utils/filters/advancedFilters";

import { AppliedLabels } from "./AppliedLabels";

const conceptLabel: TLabelResult = {
  id: "concept::Q567",
  type: "concept",
  value: "renewable energy",
};

const filters = addLabelRule(createGroup(), "concept::Q567");
const availableFilters = [conceptLabel];
const labels = ["concept::Q567"];

describe("AppliedLabels", () => {
  it("displays the human-readable concept name instead of the Wikibase ID", () => {
    render(<AppliedLabels filters={filters} availableFilters={availableFilters} labels={labels} />);

    expect(screen.getByText("renewable energy")).toBeInTheDocument();
    expect(screen.queryByText("Q567")).not.toBeInTheDocument();
  });

  it("falls back to the id suffix when no match found in availableFilters", () => {
    render(<AppliedLabels filters={addLabelRule(createGroup(), "concept::Q567")} availableFilters={[]} labels={["concept::Q567"]} />);

    expect(screen.getByText("Q567")).toBeInTheDocument();
  });
});
