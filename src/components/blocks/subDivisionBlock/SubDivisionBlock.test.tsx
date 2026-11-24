import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";

import { GeographyV2 } from "@/types";

import { SubDivisionBlock } from "./SubDivisionBlock";

vi.mock("next/router", () => nextRouterMock);

const mockUseSubdivisions = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useSubdivisions", () => ({ default: mockUseSubdivisions }));

const subdivision = (id: string, name: string): GeographyV2 => ({
  id,
  type: "subdivision",
  slug: id.toLowerCase(),
  name,
  subconcept_of: [],
  has_subconcept: [],
});

const withDocuments = (...codes: string[]) => {
  mockUseSubdivisions.mockReturnValue({ data: codes.map((code) => ({ code, name: code, type: "subdivision", count: 1 })) });
};

describe("SubDivisionBlock", () => {
  it("links a subdivision with documents and greys out one without", () => {
    withDocuments("ES-CT");

    render(<SubDivisionBlock subdivisions={[subdivision("ES-CT", "Catalunya"), subdivision("ES-GA", "Galicia")]} />);

    expect(screen.getByRole("link", { name: "Catalunya" })).toHaveAttribute("href", "/geographies/es-ct");
    expect(screen.getByText("Galicia")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Galicia" })).not.toBeInTheDocument();
  });

  it("shows only the legacy subdivision that has documents, not its ISO twin of the same name", () => {
    withDocuments("ES-19572", "ES-CT");

    render(
      <SubDivisionBlock subdivisions={[subdivision("ES-19572", "Andalucía"), subdivision("ES-AN", "Andalucía"), subdivision("ES-CT", "Catalunya")]} />
    );

    expect(screen.getAllByText("Andalucía")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Andalucía" })).toHaveAttribute("href", "/geographies/es-19572");
  });

  it("keeps both of two subdivisions with the same name when neither has documents", () => {
    withDocuments("ES-CT");

    render(<SubDivisionBlock subdivisions={[subdivision("ES-CT", "Catalunya"), subdivision("ES-A", "Same"), subdivision("ES-B", "Same")]} />);

    expect(screen.getAllByText("Same")).toHaveLength(2);
  });

  it("renders nothing when no subdivision has documents", () => {
    withDocuments();

    const { container } = render(<SubDivisionBlock subdivisions={[subdivision("ES-GA", "Galicia")]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
