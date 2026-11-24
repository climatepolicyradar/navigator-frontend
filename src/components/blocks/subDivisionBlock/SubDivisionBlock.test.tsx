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

  it("keeps both of two subdivisions with the same name, as Spain has for La Rioja", () => {
    withDocuments("ES-CT");

    render(<SubDivisionBlock subdivisions={[subdivision("ES-CT", "Catalunya"), subdivision("ES-A", "Same"), subdivision("ES-B", "Same")]} />);

    expect(screen.getAllByText("Same")).toHaveLength(2);
  });

  it("greys out every subdivision when none has documents", () => {
    withDocuments();

    render(<SubDivisionBlock subdivisions={[subdivision("ES-GA", "Galicia"), subdivision("ES-CT", "Catalunya")]} />);

    expect(screen.getByText("Galicia")).toBeInTheDocument();
    expect(screen.getByText("Catalunya")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders nothing when the country has no subdivisions", () => {
    withDocuments();

    const { container } = render(<SubDivisionBlock subdivisions={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
