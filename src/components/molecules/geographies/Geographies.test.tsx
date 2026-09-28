import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";

import { ID_SEPARATOR } from "@/constants/chars";
import { DEFAULT_FEATURES } from "@/constants/features";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabel } from "@/types";

import { Geographies } from "./Geographies";

vi.mock("next/router", () => nextRouterMock);

const geographyLabel = (type: string, id: string, value: string, children: TLabel[] = []): TLabel => ({
  id: [type, id].join(ID_SEPARATOR),
  type,
  value,
  children,
});

const renderGeographies = (props: React.ComponentProps<typeof Geographies>) =>
  render(
    <FeaturesContext.Provider value={DEFAULT_FEATURES}>
      <Geographies {...props} />
    </FeaturesContext.Provider>
  );

const manyCountries = [
  geographyLabel("country", "CAN", "Canada"),
  geographyLabel("country", "USA", "United States"),
  geographyLabel("country", "GBR", "United Kingdom"),
  geographyLabel("country", "FRA", "France"),
  geographyLabel("country", "DEU", "Germany"),
];

describe("Geographies", () => {
  it("renders a single country", () => {
    renderGeographies({ geographyLabels: [geographyLabel("country", "CAN", "Canada")], hierarchySeparator: " > " });

    expect(screen.getByRole("link", { name: "Canada" })).toBeInTheDocument();
  });

  it("renders a single subdivision", () => {
    renderGeographies({ geographyLabels: [geographyLabel("subdivision", "Ohio", "Ohio")], hierarchySeparator: " > " });

    expect(screen.getByText("Ohio")).toBeInTheDocument();
  });

  it("renders a country and subdivision separated by the hierarchy separator", () => {
    renderGeographies({
      geographyLabels: [geographyLabel("country", "USA", "United States", [geographyLabel("subdivision", "Ohio", "Ohio")])],
      hierarchySeparator: " > ",
      separatorClasses: "text-text-tertiary",
    });

    expect(screen.getByRole("link", { name: "United States" })).toBeInTheDocument();
    expect(screen.getByText("Ohio")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("renders a country and multiple subdivisions separated by commas", () => {
    renderGeographies({
      geographyLabels: [
        geographyLabel("country", "USA", "United States", [
          geographyLabel("subdivision", "Pennsylvania", "Pennsylvania"),
          geographyLabel("subdivision", "Ohio", "Ohio"),
        ]),
      ],
      hierarchySeparator: " > ",
    });

    expect(screen.getByRole("link", { name: "United States" })).toBeInTheDocument();
    expect(screen.getByText("Ohio")).toBeInTheDocument();
    expect(screen.getByText("Pennsylvania")).toBeInTheDocument();
    expect(screen.getAllByText(",")).toHaveLength(2);
  });

  it("renders multiple countries with flags hidden", () => {
    renderGeographies({ geographyLabels: manyCountries.slice(0, 2), hierarchySeparator: " > ", showFlags: false });

    expect(screen.getByRole("link", { name: "Canada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "United States" })).toBeInTheDocument();
    expect(screen.queryByText("🇨🇦")).not.toBeInTheDocument();
  });

  it("hides geographies beyond the limit with no action when limitOnClick is not provided", () => {
    const { container } = renderGeographies({ geographyLabels: manyCountries, hierarchySeparator: " > ", limit: 3 });

    expect(screen.getByRole("link", { name: "Canada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "France" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Germany" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "United States" })).not.toBeInTheDocument();
    expect(container).toHaveTextContent("+2");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides geographies beyond the limit with a clickable action when limitOnClick is provided", () => {
    const limitOnClick = vi.fn();
    renderGeographies({
      geographyLabels: manyCountries,
      hierarchySeparator: " > ",
      limit: 3,
      limitOnClick,
      limitSuffix: ["other", "others"],
    });

    const button = screen.getByRole("button", { name: "+2 others" });
    button.click();

    expect(limitOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders a single region as plain text with no link", () => {
    renderGeographies({ geographyLabels: [geographyLabel("region", "EUR", "Europe")], hierarchySeparator: " > " });

    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders multiple regions as plain text with no links", () => {
    renderGeographies({
      geographyLabels: [geographyLabel("region", "EUR", "Europe"), geographyLabel("region", "SAS", "South Asia")],
      hierarchySeparator: " > ",
    });

    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("South Asia")).toBeInTheDocument();
    expect(screen.getAllByText(",")).toHaveLength(1);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not render a region when a country is also present", () => {
    renderGeographies({
      geographyLabels: [geographyLabel("region", "EUR", "Europe"), geographyLabel("country", "FRA", "France")],
      hierarchySeparator: " > ",
    });

    expect(screen.getByRole("link", { name: "France" })).toBeInTheDocument();
    expect(screen.queryByText("Europe")).not.toBeInTheDocument();
  });
});
