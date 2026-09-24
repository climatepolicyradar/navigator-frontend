import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";

import { ID_SEPARATOR } from "@/constants/chars";
import { DEFAULT_FEATURES } from "@/constants/features";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabel } from "@/types";

import { Geography } from "./Geography";

vi.mock("next/router", () => nextRouterMock);

const geographyLabel = (type: string, id: string, value: string): TLabel => ({ id, type, value, children: [] });

const renderGeography = (label: TLabel, features = DEFAULT_FEATURES) =>
  render(
    <FeaturesContext.Provider value={features}>
      <Geography geographyLabel={label} />
    </FeaturesContext.Provider>
  );

describe("Geography", () => {
  it("renders a country as a flag and a link to its geography page", () => {
    renderGeography(geographyLabel("country", ["country", "CAN"].join(ID_SEPARATOR), "Canada"));

    expect(screen.getByText("🇨🇦")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Canada" })).toHaveAttribute("href", "/geographies/canada");
  });

  it("converts a country's slug where a conversion is defined", () => {
    renderGeography(geographyLabel("country", ["country", "USA"].join(ID_SEPARATOR), "United States"));

    expect(screen.getByRole("link", { name: "United States" })).toHaveAttribute("href", "/geographies/united-states-of-america");
  });

  it("renders international as plain text with no link, even though it's a country", () => {
    renderGeography(geographyLabel("country", ["country", "XAB"].join(ID_SEPARATOR), "International"));

    expect(screen.getByText("International")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a region as plain text with no link", () => {
    renderGeography(geographyLabel("region", ["region", "EUR"].join(ID_SEPARATOR), "Europe"));

    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  describe("subdivisions", () => {
    const subdivision = geographyLabel("subdivision", ["subdivision", "Ohio"].join(ID_SEPARATOR), "Ohio");

    it("renders as plain text with no link when the subdivisions feature is off", () => {
      renderGeography(subdivision, { ...DEFAULT_FEATURES, subdivisions: false });

      expect(screen.getByText("Ohio")).toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders as a link to its geography page when the subdivisions feature is on", () => {
      renderGeography(subdivision, { ...DEFAULT_FEATURES, subdivisions: true });

      expect(screen.getByRole("link", { name: "Ohio" })).toHaveAttribute("href", "/geographies/ohio");
    });
  });
});
